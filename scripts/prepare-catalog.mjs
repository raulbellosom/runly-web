import {readFile,mkdir,rename,open,link,unlink,writeFile} from 'node:fs/promises';
import {resolve,sep} from 'node:path';
import {createHash,createPublicKey,verify,randomUUID} from 'node:crypto';
import {pathToFileURL} from 'node:url';

// Same public trust anchor as Runly. Rotation must update both consumers.
export const OFFICIAL_KEYS=['MCowBQYDK2VwAyEArvSedcdVX6Ldk6/0O0SdLShYt9TSdNcf/+lBL3ysJfM='];
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
export async function prepareCatalog({source,destination,fixtureKey=null}) {
 source=resolve(source);destination=resolve(destination);
 if(fixtureKey && !destination.startsWith(resolve('.artifacts')+sep))throw Error('TEST_CATALOG_REQUIRES_ARTIFACTS_OUTPUT');
 const indexBytes=await readFile(resolve(source,'index.json'));
 if(indexBytes.length>1024*1024)throw Error('CATALOG_INDEX_TOO_LARGE');
 const index=JSON.parse(indexBytes);
 if(index.schemaVersion!==1 || !Array.isArray(index.modules) || index.modules.length>1000 || Object.keys(index).some(key=>!['schemaVersion','generatedAt','modules'].includes(key)) || !Number.isFinite(Date.parse(index.generatedAt)))throw Error('CATALOG_INDEX_INVALID');
 const keys=(fixtureKey?[fixtureKey]:OFFICIAL_KEYS).map(key=>createPublicKey({key:Buffer.from(key,'base64'),type:'spki',format:'der'}));
 if(keys.some(key=>key.asymmetricKeyType!=='ed25519'))throw Error('ED25519_CATALOG_KEY_REQUIRED');
 const seen=new Set(),packages=[];
 for(const entry of index.modules) {
  const identity=`${entry.key}@${entry.version}`;
  if(seen.has(identity) || !/^[a-z][a-z0-9]*\.[a-z][a-z0-9_]*$/.test(entry.key) || !/^\d+\.\d+\.\d+(?:[-+][A-Za-z0-9.+-]+)?$/.test(entry.version) || !/^[a-f0-9]{64}$/.test(entry.sha256) || !Number.isSafeInteger(entry.size) || entry.size<1 || entry.size>25*1024*1024 || entry.packageUrl!==`packages/${entry.sha256}.zip`)throw Error('CATALOG_ENTRY_INVALID');
  seen.add(identity);
  const file=resolve(source,entry.packageUrl),handle=await open(file,'r');let zip;
  try {if((await handle.stat()).size!==entry.size)throw Error('CATALOG_PACKAGE_SIZE');zip=await handle.readFile();}finally{await handle.close();}
  if(digest(zip)!==entry.sha256 || !keys.some(key=>verify(null,Buffer.from(`${identity}:${entry.sha256}`),key,Buffer.from(entry.signature,'base64'))))throw Error('CATALOG_PACKAGE_UNTRUSTED');
  packages.push({entry,zip});
 }
 // Validate the entire export before exposing any output. Immutable packages
 // precede the final index swap. Never copy receipts, keys or other source files.
 await mkdir(resolve(destination,'packages'),{recursive:true});
 for(const {entry,zip} of packages) {
  const target=resolve(destination,entry.packageUrl);
  const temporary=target+'.'+randomUUID()+'.pending';
  await writeFile(temporary,zip,{flag:'wx'});
  try {
   try {await link(temporary,target);}catch(error){if(error.code!=='EEXIST')throw error;}
  }finally{await unlink(temporary);}
  if(digest(await readFile(target))!==digest(zip))throw Error('CATALOG_OUTPUT_CONFLICT');
 }
 const pending=resolve(destination,'index.pending.json');await writeFile(pending,indexBytes);
 await rename(pending,resolve(destination,'index.json'));
 return {modules:packages.length,sha256:digest(indexBytes)};
}
if(process.argv[1] && pathToFileURL(resolve(process.argv[1])).href===import.meta.url) {
 const option=name=>{const at=process.argv.indexOf(name);return at<0?null:process.argv[at+1];};
 const source=option('--from');if(!source)throw Error('Use --from <ledger-export> [--output <directory>] [--fixture-key <public-SPKI-file>]');
 const fixtureFile=option('--fixture-key');const fixtureKey=fixtureFile?(await readFile(resolve(fixtureFile),'utf8')).trim():null;
 console.log(JSON.stringify(await prepareCatalog({source,destination:option('--output')??'.artifacts/catalog/v1',fixtureKey})));
}
