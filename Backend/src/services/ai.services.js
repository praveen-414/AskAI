import { ChatGroq } from "@langchain/groq"


const llm = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0.7,
    maxRetries: 2,
   
})

export default llm