import {readFile,mkdir,rename,open,link,unlink,writeFile} from 'node:fs/promises';
import {resolve,sep} from 'node:path';
import {createHash,createPublicKey,verify,randomUUID} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {OFFICIAL_KEYS} from './prepare-catalog.mjs';

// Catalog v2 (community/official/managed, sequenced and signed) is prepared in
// parallel to v1 and never replaces it. No production community key exists yet:
// until it is pinned here and in Runly, only TEST keys with .artifacts/ output.
export const COMMUNITY_KEYS=[];
const RELEASE_DOMAIN='runly.catalog.v2.community-release\n',SNAPSHOT_DOMAIN='runly.catalog.v2.snapshot\n';
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const canonical=value=>Array.isArray(value)?value.map(canonical):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])])):value;
const canonicalBytes=value=>Buffer.from(JSON.stringify(canonical(value)),'utf8');
const keyIdOf=key=>digest(Buffer.from(key,'base64'));
const ed25519=key=>{const value=createPublicKey({key:Buffer.from(key,'base64'),type:'spki',format:'der'});if(value.asymmetricKeyType!=='ed25519')throw Error('ED25519_CATALOG_KEY_REQUIRED');return value;};
const statement=e=>({publisher:e.publisher,key:e.key,version:e.version,sha256:e.sha256,size:e.size,capabilities:e.capabilities,consumes:e.consumes,events:e.events,connections:e.connections,dependencies:e.dependencies,compatibility:e.compatibility,provenance:e.provenance});

export async function prepareCatalogV2({source,destination,fixtureKey=null,fixtureOfficialKey=null}) {
 source=resolve(source);destination=resolve(destination);
 if((fixtureKey||fixtureOfficialKey) && !destination.startsWith(resolve('.artifacts')+sep))throw Error('TEST_CATALOG_REQUIRES_ARTIFACTS_OUTPUT');
 const communityKeys=fixtureKey?[fixtureKey]:COMMUNITY_KEYS;
 if(!communityKeys.length)throw Error('COMMUNITY_CATALOG_KEY_NOT_PROVISIONED');
 const officialKeys=fixtureOfficialKey?[fixtureOfficialKey]:OFFICIAL_KEYS;
 if(communityKeys.some(key=>officialKeys.includes(key)||OFFICIAL_KEYS.includes(key)))throw Error('COMMUNITY_KEY_OVERLAPS_OFFICIAL');
 const indexBytes=await readFile(resolve(source,'index.json'));
 if(indexBytes.length>4*1024*1024)throw Error('CATALOG_INDEX_TOO_LARGE');
 const envelope=JSON.parse(indexBytes),signed=envelope?.signed;
 if(!signed||signed.schemaVersion!==2||signed.catalog!=='runly-v2'||!Number.isSafeInteger(signed.sequence)||signed.sequence<1||!Array.isArray(signed.entries)||!Array.isArray(envelope.signatures))throw Error('CATALOG_V2_INVALID');
 const snapshotSha=digest(canonicalBytes(signed));
 const trusted=new Map(communityKeys.map(key=>[keyIdOf(key),key]));
 const announced=new Map(signed.trust.keys.map(key=>[key.keyId,key]));
 if(!envelope.signatures.some(s=>trusted.has(s.keyId)&&announced.get(s.keyId)?.state!=='revoked'&&verify(null,Buffer.from(`${SNAPSHOT_DOMAIN}${signed.sequence}:${snapshotSha}`),ed25519(trusted.get(s.keyId)),Buffer.from(s.signature,'base64'))))throw Error('CATALOG_V2_SIGNATURE_UNTRUSTED');
 // Never move the public feed backwards or swap a published sequence.
 try {
  const current=JSON.parse(await readFile(resolve(destination,'index.json')));
  if(signed.sequence<current.signed.sequence)throw Error('CATALOG_V2_ROLLBACK');
  if(signed.sequence===current.signed.sequence&&digest(canonicalBytes(current.signed))!==snapshotSha)throw Error('CATALOG_V2_EQUIVOCATION');
 }catch(error){if(error.code!=='ENOENT')throw error;}
 const seen=new Set(),packages=[];
 for(const entry of signed.entries) {
  const identity=`${entry.key}@${entry.version}`;
  if(seen.has(identity)||!/^custom\.[a-z][a-z0-9_]{1,39}$/.test(entry.key)||!/^[a-f0-9]{64}$/.test(entry.sha256)||!Number.isSafeInteger(entry.size)||entry.size<1||entry.size>25*1024*1024||entry.packageUrl!==`packages/${entry.sha256}.zip`)throw Error('CATALOG_ENTRY_INVALID');
  seen.add(identity);
  const ok=entry.trust==='official'
   ? entry.publisher===null&&officialKeys.some(key=>verify(null,Buffer.from(`${identity}:${entry.sha256}`),ed25519(key),Buffer.from(entry.signature,'base64')))
   : entry.trust==='community'&&trusted.has(entry.keyId)&&verify(null,Buffer.concat([Buffer.from(RELEASE_DOMAIN),canonicalBytes(statement(entry))]),ed25519(trusted.get(entry.keyId)),Buffer.from(entry.signature,'base64'));
  if(!ok)throw Error('CATALOG_PACKAGE_UNTRUSTED');
  const handle=await open(resolve(source,entry.packageUrl),'r');let zip;
  try{if((await handle.stat()).size!==entry.size)throw Error('CATALOG_PACKAGE_SIZE');zip=await handle.readFile();}finally{await handle.close();}
  if(digest(zip)!==entry.sha256)throw Error('CATALOG_PACKAGE_UNTRUSTED');
  packages.push({entry,zip});
 }
 // Validate everything before exposing output; immutable packages and the
 // sequenced snapshot precede the index swap. Never copy keys or receipts.
 await mkdir(resolve(destination,'packages'),{recursive:true});await mkdir(resolve(destination,'snapshots'),{recursive:true});
 const immutable=async(target,bytes)=>{
  const temporary=target+'.'+randomUUID()+'.pending';await writeFile(temporary,bytes,{flag:'wx'});
  try{try{await link(temporary,target);}catch(error){if(error.code!=='EEXIST')throw error;}}finally{await unlink(temporary);}
  if(digest(await readFile(target))!==digest(bytes))throw Error('CATALOG_OUTPUT_CONFLICT');
 };
 for(const {entry,zip} of packages)await immutable(resolve(destination,entry.packageUrl),zip);
 await immutable(resolve(destination,'snapshots',`${signed.sequence}.json`),indexBytes);
 const pending=resolve(destination,'index.pending.json');await writeFile(pending,indexBytes);
 await rename(pending,resolve(destination,'index.json'));
 return {sequence:signed.sequence,entries:packages.length,sha256:snapshotSha};
}
if(process.argv[1] && pathToFileURL(resolve(process.argv[1])).href===import.meta.url) {
 const option=name=>{const at=process.argv.indexOf(name);return at<0?null:process.argv[at+1];};
 const source=option('--from');if(!source)throw Error('Use --from <community-export> [--output <directory>] [--fixture-key <public-SPKI-file>] [--fixture-official-key <public-SPKI-file>]');
 const read=async name=>{const file=option(name);return file?(await readFile(resolve(file),'utf8')).trim():null;};
 console.log(JSON.stringify(await prepareCatalogV2({source,destination:option('--output')??'.artifacts/catalog/v2',fixtureKey:await read('--fixture-key'),fixtureOfficialKey:await read('--fixture-official-key')})));
}
