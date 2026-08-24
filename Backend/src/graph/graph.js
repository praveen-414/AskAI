import {
  StateGraph,
  START,
  END,
  MessagesAnnotation,
} from "@langchain/langgraph";
import llm from "../services/ai.services.js";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const tavilyTool = new TavilySearch({
  maxResults: 5,
  topic: "general",
});

// Current time
const getCurrentTime = tool(
  ({ timeZone }) => {
    return new Date().toLocaleString("en-US", {
      timeZone,
      dateStyle: "full",
      timeStyle: "long",
    });
  },
  {
    name: "get_current_time",
    description:
      "Get the current date and time for any location. Use this when the user asks for the current time in a city or country.",
    schema: z.object({
      timeZone: z
        .string()
        .describe("IANA timezone, such as Asia/Kolkata or America/New_York"),
    }),
  },
);

export const tools = [tavilyTool, getCurrentTime];
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
