// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import JSZip from 'jszip'

const types:any = {};
const fileList:any[any] = [];
chrome.devtools.inspectedWindow.getResources((resources) => {
    
    resources.forEach((resource:any) => {
        if (!(resource.type in types)) {
            types[resource.type] = 0;
            console.log(resource);
        }
    types[resource.type] += 1;
    if (resource.url.includes('webpack')){
        getContent(resource);
    }
    resource.getContent((content:any, encoding:any) => {
      if (!content) {
//        console.log(`Content of ${resource.url}:`, content);
//        console.log(`Content of ${resource.url}:`, content);
//      } else {
        console.log(`No content available for ${resource.url}`);
      }
    });
  });

  createZip();

  let result = `Resources on this page: 
  ${Object.entries(types)
    .map((entry) => {
      const [type, count] = entry;
      return `${type}: ${count}`;
    })
    .join('\n')}`;
  let div = document.createElement('div');
  div.innerText = result;
  document.body.appendChild(div);
});

async function getContent(resource: any){
    if (resource.type === 'sm-script' || resource.type === 'script'){
        fileList.push(resource);
    }
//    console.log(fileList);
    return ;
}

async function createZip(){
    const zip = new JSZip();

    for(const file of fileList){
        const relativePath = file.url.split("://")[1];

        try{
            const content:any = await new Promise((resolve,reject)=>{
                file.getContent((content:any, encoding:any)=>{
                    if(content)
                        resolve(content);
                    else
                        reject(new Error("failed to get the content"));
                });
            })
            zip.file(relativePath, content);
        } catch(error){
            console.error(error);
        }
    }
    const zipBlob = await zip.generateAsync({type: 'blob'});
    
    saveBlob(zipBlob, "mssec.zip");
}


function saveBlob(blob: any, filename:string){
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    link.innerHTML = "Click Here to download the file";
//    document.body.appendChild(link);
    link.click();
//    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
}