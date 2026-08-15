import {
  StateGraph,
  START,
  END,
  MessagesAnnotation,
} from "@langchain/langgraph";
import llm from "../services/ai.services.js";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";


const tool = new TavilySearch({
  maxResults: 5,
  topic: "general",
});

export const tools = [tool];
const toolNode = new ToolNode(tools);

const llmWithTools = llm.bindTools(tools);

const callLLM = async (state) => {
  const response = await llmWithTools.invoke(state.messages);

  return {
    messages: [response],
  };
};

const graph = new StateGraph(MessagesAnnotation)
  .addNode("agent", callLLM)
  .addNode("tools", toolNode)
  .addConditionalEdges("agent", (state) => {
    const lastMessage = state.messages[state.messages.length - 1];
    if (lastMessage.tool_calls.length > 0) {
      return "tools";
    }
    return END;
  })
  .addEdge("tools", "agent")
  .addEdge(START, "agent");
const chatGraph = graph.compile();

export default chatGraph;
