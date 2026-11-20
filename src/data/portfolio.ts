export const portfolio = {
 name:'Manas Soni',
 overline:'AI / ML ENGINEER · GENERATIVE AI · AGENTIC SYSTEMS',
 pitch:'Building reliable AI products — from retrieval and agents to machine learning pipelines.',
 roles:['Generative AI Developer','Agentic AI Builder','RAG Systems Engineer','Applied Machine Learning'],
 email:'manassoninit@gmail.com',
 phone:'+91 90988-47273',
 phoneHref:'tel:+919098847273',
 profileImage:'/manas-portrait.jpg',
 location:'India',
 links:{linkedin:'https://www.linkedin.com/in/manas-soni-376817319/',github:'https://github.com/Balishtha1',resume:'/Manas_Soni_Resume.pdf'},
 bio:'MCA student at NIT Raipur focused on GenAI, retrieval systems, autonomous agents and applied machine learning. I design practical AI workflows with attention to grounding, evaluation and engineering quality.',
 education:[
  {degree:'Master of Computer Applications',school:'National Institute of Technology, Raipur',years:'2027',detail:'Postgraduate studies in computer applications'},
  {degree:'B.Sc. · Computer Science',school:'Shri Vaishnav Institute of Management & Science, Indore',years:'2024',detail:'Undergraduate foundation in computer science'}
 ],
 work:{title:'SDE – AI Training (Freelance)',company:'Scale AI · Outlier AI',period:'AUG 2024 — JAN 2025',summary:'Improved AI-generated code quality through rigorous evaluation, debugging and model feedback.',points:['Evaluated model-generated code for correctness, edge cases, efficiency and engineering quality.','Debugged implementations and gave structured feedback to improve LLM reasoning and code generation.','Designed test cases covering algorithmic correctness, complexity and robustness.'],skills:['LLM evaluation','Code quality','Test design','Debugging']},
 projects:[
  {number:'01',slug:'rag',name:'RAG From Scratch',kind:'RETRIEVAL / GENERATIVE AI',description:'A document-aware answer engine combining embeddings, semantic search, retrieval and generation.',detail:'Engineered an end-to-end retrieval-augmented generation pipeline: document indexing, chunking, embedding models, vector search and contextual responses. Designed retrieval and generation workflows to improve grounding and reduce hallucinations.',stack:['LangChain','FAISS / ChromaDB','Embeddings','LLMs'],accent:'#7fe6db',signal:'SEMANTIC SEARCH'},
  {number:'02',slug:'agent',name:'AI Social Media Agent',kind:'AGENTIC AI / AUTOMATION',description:'An autonomous content workflow with human approval, OAuth-connected tools and automated scheduling.',detail:'Built an agent using LangGraph to generate, review and schedule content through human-in-the-loop approval. Integrated Slack, OAuth authentication, cron-based publishing and external tool calls.',stack:['LangGraph','OAuth','Slack','Cron','Tool calling'],accent:'#b9a8ff',signal:'HUMAN IN THE LOOP'},
  {number:'03',slug:'fraud',name:'AI Fraud Detection System',kind:'UNSUPERVISED LEARNING',description:'Anomaly detection across 284,807 transactions in a heavily imbalanced financial dataset.',detail:'Developed an unsupervised fraud detection workflow with preprocessing, class imbalance analysis and anomaly-detection methods to flag unusual financial transactions.',stack:['Python','scikit-learn','Anomaly detection','Data processing'],accent:'#ffbd7d',signal:'284,807 RECORDS'}
 ],
 skills:{
  'LANGUAGES':['Python','C++','R','Java','SQL'],
  'GEN AI / AGENTS':['LangChain','LangGraph','LlamaIndex','RAG','Fine-tuning','OpenAI APIs','Hugging Face','Prompt engineering'],
  'ML / DEEP LEARNING':['PyTorch','TensorFlow','Keras','scikit-learn','NLP','Computer vision','Reinforcement learning'],
  'MLOPS / CLOUD':['Docker','Kubernetes','MLflow','AWS','Vertex AI','Azure ML','Apache Spark'],
  'DATA / VISION':['Pandas','NumPy','OpenCV','Feature engineering','Embeddings','Semantic search']
 },
 certifications:['Supervised Machine Learning: Regression and Classification — DeepLearning.AI & Stanford University','Advanced Learning Algorithms — DeepLearning.AI & Stanford University'],
 milestones:[{year:'2024',title:'NIMCET · AIR 783',description:'Top 1.6% among 50,000+ participants.'},{year:'2024',title:'Joined NIT Raipur',description:'Started Master of Computer Applications.'},{year:'2024–25',title:'Scale AI / Outlier',description:'Evaluated, tested and improved AI-generated code.'},{year:'NOW',title:'Building agentic systems',description:'Exploring the next generation of applied intelligence.'}]
};
export const sectors = [
 {id:'sun',planet:'SUN',label:'Identity',altitude:'001'},
 {id:'earth',planet:'EARTH',label:'Origin',altitude:'002'},
 {id:'education',planet:'EARTH ORBIT',label:'Education',altitude:'003'},
 {id:'moon',planet:'MOON',label:'Experience',altitude:'004'},
 {id:'mars',planet:'MARS',label:'Projects',altitude:'005'},
 {id:'jupiter',planet:'JUPITER',label:'Tech Stack',altitude:'006'},
 {id:'saturn',planet:'SATURN',label:'Trajectory',altitude:'007'},
 {id:'neptune',planet:'NEPTUNE',label:'Contact',altitude:'008'}
] as const;
export function validLink(value:string){return !!value && !value.includes('[') && /^(https?:\/\/|mailto:|\/)/i.test(value)}
