const projects = {
 evalops: {
  name:'EvalOps', type:'LLM tracing & evaluation', intro:'A way to look inside an LLM interaction, inspect its context, and evaluate the response instead of judging it by how convincing it sounds.', tags:['Python','FastAPI','RAGAS','Streamlit','pytest'], repo:'evalops',
  sections:[{title:'The problem',text:'A plausible answer is not necessarily a faithful one. Prompts, responses, latency, and retrieved context need to be visible together before you can investigate what happened.'},{title:'What I built',items:['A Python SDK for capturing LLM interactions and latency, with optional token counts and retrieval context.','A FastAPI service that stores traces and triggers background RAGAS faithfulness and answer-relevancy evaluations.','A Streamlit dashboard with overview metrics, time trends, filters, and individual trace inspection.']},{title:'Making it testable',text:'The project includes 52 tests covering the API, evaluator, and SDK. External calls are mocked so individual behaviors can be checked without live services.'}], note:'Project scope: these unit tests do not establish live-service compatibility. Evaluation runs in an in-process background task; this is a learning project, not a production reliability claim.'
 },
 nexus:{name:'NEXUS',type:'Retrieval-augmented study assistant',intro:'A study workspace that brings questions, source passages, and answers into one conversation.',tags:['Python','Flask','LangChain','FAISS','Groq'],repo:'Nexus',
 sections:[{title:'The problem',text:'Useful information can be scattered across PDFs, audio, and video. Finding the right passage is often harder than asking the question.'},{title:'What I built',items:['A document-processing flow that splits content into chunks and indexes embeddings with FAISS.','Prompt templates that combine a question with retrieved passages and call the Groq LLM API.','Flask endpoints that stream answers to the browser, with source excerpts available for inspection.']},{title:'A detail that matters',text:'The saved FAISS index is reused when source files are unchanged, avoiding unnecessary re-indexing. The interface keeps supporting material close to the answer.'}],note:'Project scope: retrieval and source excerpts help with inspection, but do not guarantee answer accuracy. The portfolio preview is an illustrative interface study.'},
 jobflowq:{name:'JobFlowQ',type:'Job processing & events',intro:'A Java project exploring job lifecycle states, retry limits, and the events that connect an application.',tags:['Java 17','Spring Boot','Kafka','Docker Compose'],repo:'jobflowq',
 sections:[{title:'The problem',text:'Submitting work is only the beginning. A background system also needs to represent progress, handle failures, and make its state inspectable.'},{title:'What I built',items:['REST APIs to submit, inspect, list, and cancel jobs, with queue metrics and Swagger documentation.','Retry limits and a dead-letter state for jobs that reach their failure threshold.','Kafka lifecycle events keyed by job ID, plus Docker Compose for the local application stack.']},{title:'Checking the behavior',text:'Eleven isolated unit tests cover job services, retry handling, and Kafka events. The tests use mocks, so they can run without live infrastructure.'}],note:'Project scope: job execution currently simulates work. Kafka publishing is best-effort, and the project does not claim exactly-once execution or production-scale reliability.'}
};
const implementation = {
 evalops: {flow:['Capture a trace','Store via FastAPI','Trigger evaluation','Inspect in Streamlit'], decision:'Trace collection and evaluation are separate steps. This makes them easier to inspect and test; the current background task runs inside the API process, so a durable worker queue would be needed for stronger recovery guarantees.', sources:[['API & evaluation trigger','evalops/blob/main/api/main.py'],['API, evaluator & SDK tests','evalops/tree/main/tests']]},
 nexus: {flow:['Read & chunk files','Embed into FAISS','Retrieve context','Stream an answer'], decision:'The index is cached against a fingerprint of the source data. Unchanged files reuse the saved index; changed files trigger a rebuild. This avoids repeating the embedding work on every startup.', sources:[['Retrieval & index caching','Nexus/blob/main/rag.py'],['Streaming API','Nexus/blob/main/server.py']]},
 jobflowq: {flow:['Submit & store job','Poll & process','Retry or finish','Publish lifecycle events'], decision:'A finite retry limit moves repeated failures into a DEAD state. Kafka publishes lifecycle events alongside this flow; it is not the work queue. Execution is currently simulated, and database updates and event delivery are not atomic.', sources:[['Worker & retry handling','jobflowq/blob/main/src/main/java/com/jobflowq/jobflowq/service/JobWorkerService.java'],['Service & event tests','jobflowq/tree/main/src/test/java']]}
};
const dialog = document.querySelector('#project-dialog');
let previousFocus, activeProject, returnHash = '#work';
function openProject(key, updateURL = true){
 const project=projects[key]; if(!project)return;
 if(!dialog.open) previousFocus=document.activeElement;
 activeProject=key;
 if(updateURL){returnHash=location.hash || '#work';history.pushState(null,'',`#project-${key}`);}
 document.querySelector('#dialog-title').textContent=project.name;
 document.querySelector('#dialog-type').textContent=project.type;
 document.querySelector('#dialog-intro').textContent=project.intro;
 document.querySelector('#project-copy-status').textContent='';
 document.querySelector('#dialog-tags').replaceChildren(...project.tags.map(tag=>{const e=document.createElement('span');e.textContent=tag;return e;}));
 const content=document.querySelector('#dialog-content');content.replaceChildren();
 const detail=implementation[key];
 const flowTitle=document.createElement('h3');flowTitle.textContent='How the pieces connect';content.append(flowTitle);
 const flow=document.createElement('ol');flow.className='architecture-flow';
 for(const step of detail.flow){const item=document.createElement('li');item.textContent=step;flow.append(item);}content.append(flow);
 for(const section of project.sections){
  const title=document.createElement('h3');title.textContent=section.title;content.append(title);
  if(section.text){const p=document.createElement('p');p.textContent=section.text;content.append(p);}
  if(section.items){const ul=document.createElement('ul');for(const text of section.items){const li=document.createElement('li');li.textContent=text;ul.append(li);}content.append(ul);}
 }
 const decisionTitle=document.createElement('h3');decisionTitle.textContent='An engineering decision';content.append(decisionTitle);
 const decision=document.createElement('p');decision.textContent=detail.decision;content.append(decision);
 const sourceList=document.createElement('div');sourceList.className='source-links';sourceList.setAttribute('aria-label','Implementation references');
 for(const [label,path] of detail.sources){const link=document.createElement('a');link.href=`https://github.com/Aayush-25/${path}`;link.target='_blank';link.rel='noopener';link.textContent=label+' ↗';sourceList.append(link);}content.append(sourceList);
 const note=document.createElement('p');note.className='honest-note';note.textContent=project.note;content.append(note);
 document.querySelector('#dialog-github').href=`https://github.com/Aayush-25/${project.repo}`;
 if(!dialog.open)dialog.showModal();dialog.scrollTop=0;document.body.classList.add('modal-open');
}
function syncProjectURL(){
 const key=location.hash.replace('#project-','');
 if(location.hash.startsWith('#project-') && projects[key])openProject(key,false);
 else if(dialog.open)dialog.close();
}
for(const button of document.querySelectorAll('[data-project]'))button.addEventListener('click',()=>openProject(button.dataset.project));
for(const button of document.querySelectorAll('.dialog-close,.dialog-close-text'))button.addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
dialog.addEventListener('close',()=>{
 document.body.classList.remove('modal-open');
 if(location.hash===`#project-${activeProject}`)history.replaceState(null,'',returnHash);
 if(previousFocus && previousFocus !== document.body)previousFocus.focus({preventScroll:true});
 else document.querySelector('[data-project="'+activeProject+'"]').focus({preventScroll:true});
});
window.addEventListener('hashchange',syncProjectURL);
syncProjectURL();
document.querySelector('#copy-project-link').addEventListener('click',async()=>{
 const status=document.querySelector('#project-copy-status');
 const url=`https://aayushupadhyay.dev/#project-${activeProject}`;
 try{await navigator.clipboard.writeText(url);status.textContent='Project link copied.';}
 catch{status.textContent=url;}
});
document.querySelector('#copy-email').addEventListener('click',async()=>{
 const status=document.querySelector('#copy-status');
 try{await navigator.clipboard.writeText('aayushupadhyaydev@gmail.com');status.textContent='Email copied. Let’s start a conversation.';}
 catch{status.textContent='Copy this address: aayushupadhyaydev@gmail.com';}
});
