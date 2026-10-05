import {test,expect} from 'vitest';
import {mkdtemp,mkdir,writeFile,readFile,access} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve,join} from 'node:path';
import {createHash,generateKeyPairSync,sign,randomUUID} from 'node:crypto';
import {prepareCatalogV2} from './prepare-catalog-v2.mjs';
import {OFFICIAL_KEYS} from './prepare-catalog.mjs';

const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const canonical=value=>Array.isArray(value)?value.map(canonical):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])])):value;
const pair=()=>{const k=generateKeyPairSync('ed25519');return {privateKey:k.privateKey,publicKey:k.publicKey.export({type:'spki',format:'der'}).toString('base64')};};
function fixture(community,{sequence=1,description=''}={}) {
 const zip=Buffer.from('synthetic community fixture'),sha256=digest(zip),keyId=digest(Buffer.from(community.publicKey,'base64'));
 const entry={trust:'community',key:'custom.fixture',version:'1.0.0',sha256,size:zip.length,packageUrl:`packages/${sha256}.zip`,publisher:'acme-labs',listed:true,status:'published',publishedAt:'2026-10-05T00:00:00.000Z',name:'Fixture',description,icon:'Boxes',color:'#2563EB',changelog:'',capabilities:[],consumes:{},events:[],connections:[],dependencies:[],compatibility:{runly:{min:'0.1.0',max:null},contracts:{engine:1,compiler:1,runtime:1,capabilities:1}},provenance:{evidenceSha256:'b'.repeat(64),toolchainId:'c'.repeat(64)},keyId,signature:''};
 const st={publisher:entry.publisher,key:entry.key,version:entry.version,sha256,size:entry.size,capabilities:[],consumes:{},events:[],connections:[],dependencies:[],compatibility:entry.compatibility,provenance:entry.provenance};
 entry.signature=sign(null,Buffer.concat([Buffer.from('runly.catalog.v2.community-release\n'),Buffer.from(JSON.stringify(canonical(st)))]),community.privateKey).toString('base64');
 const signed={schemaVersion:2,catalog:'runly-v2',sequence,generatedAt:'2026-10-05T00:00:00.000Z',validUntil:'2026-10-12T00:00:00.000Z',previous:null,trust:{keys:[{keyId,publicKey:community.publicKey,role:'community',state:'active',since:'2026-10-04T00:00:00.000Z',until:null,reason:null}]},publishers:[{handle:'acme-labs',displayName:'Acme Labs',verified:true,state:'active',reason:null,revokedAt:null}],entries:[entry],revocations:[]};
 const snapshotSha=digest(Buffer.from(JSON.stringify(canonical(signed))));
 return {zip,entry,envelope:{signed,signatures:[{keyId,signature:sign(null,Buffer.from(`runly.catalog.v2.snapshot\n${sequence}:${snapshotSha}`),community.privateKey).toString('base64')}]}};
}
async function source(value) {
 const dir=await mkdtemp(join(tmpdir(),'web-catalog-v2-'));await mkdir(join(dir,'packages'));
 await writeFile(join(dir,value.entry.packageUrl),value.zip);await writeFile(join(dir,'index.json'),JSON.stringify(value.envelope));await writeFile(join(dir,'receipt.json'),'private');
 return dir;
}
test('no production community key is pinned; test keys require .artifacts output and never overlap official',async()=>{
 const community=pair(),dir=await source(fixture(community));
 await expect(prepareCatalogV2({source:dir,destination:join(tmpdir(),'out')})).rejects.toThrow('COMMUNITY_CATALOG_KEY_NOT_PROVISIONED');
 await expect(prepareCatalogV2({source:dir,destination:join(tmpdir(),'out'),fixtureKey:community.publicKey})).rejects.toThrow('TEST_CATALOG_REQUIRES_ARTIFACTS_OUTPUT');
 await expect(prepareCatalogV2({source:dir,destination:resolve('.artifacts/catalog-v2-tests',randomUUID()),fixtureKey:OFFICIAL_KEYS[0]})).rejects.toThrow('COMMUNITY_KEY_OVERLAPS_OFFICIAL');
});
test('verifies snapshot and entry signatures and bytes; refuses rollback and equivocation; copies no secrets',async()=>{
 const community=pair(),destination=resolve('.artifacts/catalog-v2-tests',randomUUID());
 const second=fixture(community,{sequence:2}),dir=await source(second);
 expect(await prepareCatalogV2({source:dir,destination,fixtureKey:community.publicKey})).toMatchObject({sequence:2,entries:1});
 await expect(access(join(destination,'receipt.json'))).rejects.toThrow();
 await access(join(destination,'snapshots','2.json'));
 const older=await source(fixture(community,{sequence:1}));
 await expect(prepareCatalogV2({source:older,destination,fixtureKey:community.publicKey})).rejects.toThrow('CATALOG_V2_ROLLBACK');
 const forked=await source(fixture(community,{sequence:2,description:'otro contenido'}));
 await expect(prepareCatalogV2({source:forked,destination,fixtureKey:community.publicKey})).rejects.toThrow('CATALOG_V2_EQUIVOCATION');
 const tampered=fixture(community,{sequence:3});tampered.envelope.signed.entries[0].description='alterado';
 await expect(prepareCatalogV2({source:await source(tampered),destination,fixtureKey:community.publicKey})).rejects.toThrow('CATALOG_V2_SIGNATURE_UNTRUSTED');
 const other=pair();
 await expect(prepareCatalogV2({source:await source(fixture(other,{sequence:3})),destination,fixtureKey:community.publicKey})).rejects.toThrow('CATALOG_V2_SIGNATURE_UNTRUSTED');
 const corrupted=fixture(community,{sequence:3}),corruptedDir=await source(corrupted);await writeFile(join(corruptedDir,corrupted.entry.packageUrl),'corrupt!!corrupt!!corrupt!!x');
 const previous=await readFile(join(destination,'index.json'));
 await expect(prepareCatalogV2({source:corruptedDir,destination,fixtureKey:community.publicKey})).rejects.toThrow();
 expect(await readFile(join(destination,'index.json'))).toEqual(previous);
});
