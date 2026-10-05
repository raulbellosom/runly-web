import {test,expect} from 'vitest';
import {mkdtemp,mkdir,writeFile,readFile,access} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve,join} from 'node:path';
import {createHash,generateKeyPairSync,sign,randomUUID} from 'node:crypto';
import {prepareCatalog} from './prepare-catalog.mjs';
test('empty fixture is static v1; TEST keys stay outside production output',async()=>{
 const destination=await mkdtemp(join(tmpdir(),'web-catalog-'));
 expect((await prepareCatalog({source:'public/catalog/v1',destination})).modules).toBe(0);
 await expect(prepareCatalog({source:'public/catalog/v1',destination,fixtureKey:'test'})).rejects.toThrow('TEST_CATALOG_REQUIRES_ARTIFACTS_OUTPUT');
});
test('validate signature and bytes before index swap; copy no secrets and preserve old ZIPs',async()=>{
 const source=await mkdtemp(join(tmpdir(),'web-catalog-')),destination=resolve('.artifacts/catalog-tests',randomUUID());
 await mkdir(join(source,'packages'));const zip=Buffer.from('synthetic fixture');const hash=createHash('sha256').update(zip).digest('hex');
 const keys=generateKeyPairSync('ed25519'),fixtureKey=keys.publicKey.export({type:'spki',format:'der'}).toString('base64');
 const entry={key:'custom.fixture',version:'1.0.0',sha256:hash,size:zip.length,packageUrl:`packages/${hash}.zip`,signature:sign(null,Buffer.from(`custom.fixture@1.0.0:${hash}`),keys.privateKey).toString('base64')};
 const index={schemaVersion:1,generatedAt:'2026-10-04T00:00:00.000Z',modules:[entry]};
 await writeFile(join(source,entry.packageUrl),zip);await writeFile(join(source,'index.json'),JSON.stringify(index));await writeFile(join(source,'do-not-copy.txt'),'private fixture');
 expect((await prepareCatalog({source,destination,fixtureKey})).modules).toBe(1);
 await expect(access(join(destination,'do-not-copy.txt'))).rejects.toThrow();
 const previous=await readFile(join(destination,'index.json'));
 await writeFile(join(source,entry.packageUrl),'corrupted');
 await expect(prepareCatalog({source,destination,fixtureKey})).rejects.toThrow();expect(await readFile(join(destination,'index.json'))).toEqual(previous);
 await writeFile(join(source,'index.json'),JSON.stringify({...index,modules:[]}));
 await prepareCatalog({source,destination,fixtureKey});await access(join(destination,entry.packageUrl));
});
