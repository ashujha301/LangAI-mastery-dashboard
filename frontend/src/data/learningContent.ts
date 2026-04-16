import type { Phase, Session, UserState } from "@/types/learning";

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 1 — LangChain Basics
// ═══════════════════════════════════════════════════════════════════════════════

const phase1Sessions: Session[] = [
  // ── Session 1.1: Introduction to LangChain (theory only) ──────────────────
  {
    id: "p1-s1",
    phaseId: "phase-1",
    title: "Introduction to LangChain",
    description:
      "Understand what LangChain is, why it exists, and how it fits into the LLM ecosystem.",
    type: "theory",
    estimatedMinutes: 20,
    theorySteps: [
      {
        id: "p1-s1-t1",
        title: "What is LangChain?",
        content: `## What is LangChain?

LangChain is an open-source framework designed to simplify building applications powered by **Large Language Models (LLMs)**. Instead of writing boilerplate code to call APIs and stitch together prompts, LangChain provides a set of composable abstractions.

### Why LangChain?

Raw LLM APIs are stateless — every call is independent. Building a real app requires:
- Managing conversation **memory**
- Chaining multiple **prompts and models**
- Connecting LLMs to external **tools and data**
- Parsing structured **outputs**

LangChain handles all of this through a unified interface.

### Core Philosophy
> "LLMs are great at generating text, but production apps need structure, state, and external knowledge."

LangChain gives you the building blocks to go from a raw model call to a production-ready AI pipeline.`,
      },
      {
        id: "p1-s1-t2",
        title: "The LangChain Ecosystem",
        content: `## The LangChain Ecosystem

LangChain is actually a family of packages:

| Package | Purpose |
|---|---|
| \`langchain-core\` | Base abstractions: Runnables, Messages, Prompts |
| \`langchain\` | Chains, agents, and retrieval strategies |
| \`langchain-community\` | Third-party integrations (100+ providers) |
| \`langgraph\` | Stateful, cyclic agent workflows |
| \`langsmith\` | Observability, tracing, and evaluation |

### The LCEL (LangChain Expression Language)

Modern LangChain uses the **pipe operator** (\`|\`) to chain components together, just like Unix pipes:

\`\`\`python
chain = prompt | llm | output_parser
result = chain.invoke({"input": "Hello!"})
\`\`\`

This is the foundation you'll build on throughout this course.`,
      },
      {
        id: "p1-s1-t3",
        title: "Setting Up Your Environment",
        content: `## Setting Up Your Environment

### Install Dependencies

\`\`\`bash
pip install langchain langchain-openai python-dotenv
\`\`\`

### Configure API Keys

Create a \`.env\` file in your project root:

\`\`\`env
OPENAI_API_KEY=sk-your-key-here
LANGCHAIN_API_KEY=ls__your-key-here   # optional, for LangSmith tracing
LANGCHAIN_TRACING_V2=true              # optional
\`\`\`

### Load Environment Variables

\`\`\`python
from dotenv import load_dotenv
load_dotenv()
\`\`\`

> **Tip:** Never commit your \`.env\` file to version control. Add it to \`.gitignore\`.`,
      },
    ],
    codeSteps: [],
    quiz: [
      {
        id: "p1-s1-q1",
        question: "What problem does LangChain primarily solve?",
        options: [
          "Training large language models from scratch",
          "Building composable applications on top of LLMs",
          "Replacing OpenAI's API entirely",
          "Deploying models to production servers",
        ],
        correctIndex: 1,
        explanation:
          "LangChain provides composable abstractions to build production-ready LLM applications — it doesn't train models or replace APIs.",
      },
      {
        id: "p1-s1-q2",
        question:
          "Which LangChain package provides the stateful, cyclic agent workflows used in this course?",
        options: [
          "langchain-core",
          "langchain-community",
          "langgraph",
          "langsmith",
        ],
        correctIndex: 2,
        explanation:
          "LangGraph is specifically designed for stateful, graph-based agent workflows — it's what Phase 2 and 3 are all about.",
      },
      {
        id: "p1-s1-q3",
        question: "What does LCEL stand for?",
        options: [
          "LangChain Execution Control Layer",
          "LangChain Expression Language",
          "Large Context Evaluation Loop",
          "LangChain External Connection Library",
        ],
        correctIndex: 1,
        explanation:
          "LCEL (LangChain Expression Language) uses the pipe operator `|` to compose chains declaratively.",
      },
      {
        id: "p1-s1-q4",
        question: "What is LangSmith used for?",
        options: [
          "Writing prompts",
          "Training models",
          "Observability, tracing, and evaluation of LLM apps",
          "Hosting LLM APIs",
        ],
        correctIndex: 2,
        explanation:
          "LangSmith is the observability layer — it records traces of your LLM calls so you can debug and evaluate them.",
      },
    ],
    qna: [
      {
        id: "p1-s1-qa1",
        question: "Do I need to use OpenAI to use LangChain?",
        answer:
          "No. LangChain supports dozens of LLM providers through `langchain-community`: Anthropic, Google Gemini, Mistral, Ollama (local models), and more. The interface is the same regardless of provider.",
      },
      {
        id: "p1-s1-qa2",
        question: "Is LangSmith required for this course?",
        answer:
          "No, LangSmith is optional. It's a paid service with a free tier that lets you see traces of your LLM calls. If you add your API key in Settings, the code examples in this course will automatically send traces to LangSmith. Otherwise, everything runs fine without it.",
      },
      {
        id: "p1-s1-qa3",
        question: "What Python version should I use?",
        answer:
          "Python 3.9 or higher is recommended. Python 3.11+ gives the best performance with async LangChain features.",
      },
      {
        id: "p1-s1-qa4",
        question: "Can I use LangChain with TypeScript?",
        answer:
          "Yes! `langchain.js` is the official TypeScript/JavaScript port and has feature parity with the Python version. This course focuses on Python, but the concepts transfer directly.",
      },
    ],
    codingProblem: null,
  },

  // ── Session 1.2: Prompt Templates ─────────────────────────────────────────
  {
    id: "p1-s2",
    phaseId: "phase-1",
    title: "Prompt Templates",
    description:
      "Learn to create reusable, parameterized prompts using LangChain's PromptTemplate and ChatPromptTemplate.",
    type: "code",
    estimatedMinutes: 35,
    theorySteps: [
      {
        id: "p1-s2-t1",
        title: "Why Prompt Templates?",
        content: `## Why Prompt Templates?

Hard-coding prompts is fine for experiments, but production apps need **dynamic prompts** — the same structure, different inputs.

### Without Templates (Bad)

\`\`\`python
prompt = f"Translate '{user_text}' to {language}."
\`\`\`

Problems: no type safety, easy to inject unintended content, hard to reuse.

### With Templates (Good)

\`\`\`python
from langchain_core.prompts import PromptTemplate

template = PromptTemplate.from_template(
    "Translate '{text}' to {language}."
)
prompt = template.invoke({"text": "Hello", "language": "Spanish"})
\`\`\`

Templates enforce structure, make inputs explicit, and integrate seamlessly into LCEL chains.`,
      },
      {
        id: "p1-s2-t2",
        title: "Chat Prompt Templates",
        content: `## Chat Prompt Templates

Most modern LLMs use a **chat interface** — a list of messages with roles (system, human, assistant). \`ChatPromptTemplate\` handles this:

\`\`\`python
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful {role}."),
    ("human", "{question}"),
])
\`\`\`

### Message Roles

| Role | Purpose |
|---|---|
| \`system\` | Sets the AI's persona and instructions |
| \`human\` / \`user\` | The user's input |
| \`assistant\` / \`ai\` | Prior AI responses (for multi-turn) |

The system message is one of the most powerful tools for controlling LLM behaviour.`,
      },
    ],
    codeSteps: [
      {
        id: "p1-s2-c1",
        title: "Step 1: Create your first PromptTemplate",
        instructions: `## Step 1: Create a Basic Prompt Template

A \`PromptTemplate\` takes a string with \`{variable}\` placeholders and formats them at runtime.

**Your task:**
1. Import \`PromptTemplate\` from \`langchain_core.prompts\`
2. Create a template that takes \`topic\` and \`audience\` as inputs
3. Format it and print the result

Run the code to see the formatted prompt before it's sent to any model.`,
        starterCode: `from langchain_core.prompts import PromptTemplate

# Create a template with {topic} and {audience} variables
template = PromptTemplate.from_template(
    "Explain {topic} to a {audience} in simple terms."
)

# Format the template with actual values
formatted = template.invoke({
    "topic": "neural networks",
    "audience": "10-year-old"
})

print(formatted.text)
`,
        expectedOutput:
          "Explain neural networks to a 10-year-old in simple terms.",
        hint: {
          code: `from langchain_core.prompts import PromptTemplate

template = PromptTemplate.from_template(
    "Explain {topic} to a {audience} in simple terms."
)

formatted = template.invoke({
    "topic": "neural networks",
    "audience": "10-year-old"
})

print(formatted.text)
`,
          explanation:
            "`PromptTemplate.from_template()` parses curly-brace variables automatically. `.invoke()` fills in the values and returns a `StringPromptValue` — `.text` extracts the final string.",
        },
      },
      {
        id: "p1-s2-c2",
        title: "Step 2: Build a ChatPromptTemplate",
        instructions: `## Step 2: Chat Prompt with System + Human Messages

Chat models expect a **list of messages**, not a single string. \`ChatPromptTemplate.from_messages()\` takes tuples of \`(role, content)\`.

**Your task:**
1. Import \`ChatPromptTemplate\`
2. Create a chat template with a system message and a human message
3. Format it and print the messages list

Notice how the output is a list of message objects, not a plain string.`,
        starterCode: `from langchain_core.prompts import ChatPromptTemplate

# Build a chat template
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an expert {domain} teacher. Be concise."),
    ("human", "Explain: {concept}"),
])

# Format with values
messages = prompt.invoke({
    "domain": "Python",
    "concept": "list comprehensions",
})

for msg in messages.messages:
    print(f"[{msg.type.upper()}] {msg.content}")
`,
        expectedOutput: `[SYSTEM] You are an expert Python teacher. Be concise.
[HUMAN] Explain: list comprehensions`,
        hint: {
          code: `from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an expert {domain} teacher. Be concise."),
    ("human", "Explain: {concept}"),
])

messages = prompt.invoke({
    "domain": "Python",
    "concept": "list comprehensions",
})

for msg in messages.messages:
    print(f"[{msg.type.upper()}] {msg.content}")
`,
          explanation:
            "`.invoke()` on a `ChatPromptTemplate` returns a `ChatPromptValue` with a `.messages` list. Each message has `.type` ('system', 'human', 'ai') and `.content`.",
        },
      },
    ],
    quiz: [
      {
        id: "p1-s2-q1",
        question:
          "Which method creates a PromptTemplate from a string with {variable} placeholders?",
        options: [
          "PromptTemplate.create()",
          "PromptTemplate.from_string()",
          "PromptTemplate.from_template()",
          "PromptTemplate.parse()",
        ],
        correctIndex: 2,
        explanation:
          "`from_template()` is the standard factory method — it auto-detects variables from the curly-brace syntax.",
      },
      {
        id: "p1-s2-q2",
        question:
          "What is the role of the 'system' message in a ChatPromptTemplate?",
        options: [
          "It stores the user's input",
          "It sets the AI's persona and instructions",
          "It holds previous conversation history",
          "It defines the output format only",
        ],
        correctIndex: 1,
        explanation:
          "The system message is the highest-priority instruction — it shapes the model's persona, constraints, and behaviour for the entire conversation.",
      },
      {
        id: "p1-s2-q3",
        question: "What does `.invoke()` return for a ChatPromptTemplate?",
        options: [
          "A plain string",
          "A dict of variables",
          "A ChatPromptValue with a .messages list",
          "An LLM response",
        ],
        correctIndex: 2,
        explanation:
          "`.invoke()` on a ChatPromptTemplate returns a `ChatPromptValue` object. Access the messages via `.messages`.",
      },
    ],
    qna: [
      {
        id: "p1-s2-qa1",
        question: "Can I use f-strings instead of PromptTemplate?",
        answer:
          "You can, but you lose the benefits of LangChain's type system: variables aren't validated, you can't compose templates into chains cleanly, and LangSmith won't label them as distinct prompt steps in traces.",
      },
      {
        id: "p1-s2-qa2",
        question: "How do I include literal curly braces in a template?",
        answer:
          'Double them: `{{` and `}}`. For example, `"Use JSON like {{\\"key\\": \\"value\\"}}"` outputs literal `{"key": "value"}` without being treated as a variable.',
      },
      {
        id: "p1-s2-qa3",
        question: "What is MessagesPlaceholder used for?",
        answer:
          "`MessagesPlaceholder` lets you inject a dynamic list of messages (e.g. conversation history) into a fixed chat template. Essential for building multi-turn chatbots.",
      },
    ],
    codingProblem: {
      id: "p1-s2-cp1",
      title: "Build a Multi-Role Prompt",
      prompt: `## Challenge: Multi-Role Chat Template

Create a \`ChatPromptTemplate\` that supports a **3-turn** structure:
1. A \`system\` message setting the AI as a "Senior {language} developer"
2. A \`human\` message asking about a \`{concept}\`
3. An \`assistant\` (ai) message with a partial answer: \`"Here's a quick overview: {partial_answer}"\`
4. A final \`human\` message: \`"Can you show me a code example?"\`

Format it with:
- language = "Python"
- concept = "decorators"
- partial_answer = "Decorators wrap functions to add behaviour."

Print each message on its own line in the format: \`[ROLE] content\``,
      starterCode: `from langchain_core.prompts import ChatPromptTemplate

# Build a 4-message chat template
prompt = ChatPromptTemplate.from_messages([
    # Add your messages here
])

messages = prompt.invoke({
    "language": "Python",
    "concept": "decorators",
    "partial_answer": "Decorators wrap functions to add behaviour.",
})

for msg in messages.messages:
    print(f"[{msg.type.upper()}] {msg.content}")
`,
      expectedOutput: `[SYSTEM] You are a Senior Python developer.
[HUMAN] Explain: decorators
[AI] Here's a quick overview: Decorators wrap functions to add behaviour.
[HUMAN] Can you show me a code example?`,
      hint: {
        code: `from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a Senior {language} developer."),
    ("human", "Explain: {concept}"),
    ("assistant", "Here's a quick overview: {partial_answer}"),
    ("human", "Can you show me a code example?"),
])

messages = prompt.invoke({
    "language": "Python",
    "concept": "decorators",
    "partial_answer": "Decorators wrap functions to add behaviour.",
})

for msg in messages.messages:
    print(f"[{msg.type.upper()}] {msg.content}")
`,
        explanation:
          "Use the 'assistant' role tuple for AI messages. Only messages with `{variables}` need corresponding keys in `.invoke()` — static messages like the last human turn need no variables.",
      },
    },
  },

  // ── Session 1.3: LLMs and Chat Models ─────────────────────────────────────
  {
    id: "p1-s3",
    phaseId: "phase-1",
    title: "LLMs and Chat Models",
    description:
      "Connect to real LLMs via LangChain, understand the difference between LLMs and ChatModels, and build your first LCEL chain.",
    type: "code",
    estimatedMinutes: 40,
    theorySteps: [
      {
        id: "p1-s3-t1",
        title: "LLMs vs Chat Models",
        content: `## LLMs vs Chat Models

LangChain distinguishes two model interfaces:

### LLMs (text-in, text-out)
\`\`\`python
from langchain_openai import OpenAI
llm = OpenAI()
response = llm.invoke("What is 2+2?")
# response is a plain string: "4"
\`\`\`

### Chat Models (messages-in, message-out)
\`\`\`python
from langchain_openai import ChatOpenAI
chat = ChatOpenAI(model="gpt-4o-mini")
response = chat.invoke("What is 2+2?")
# response is an AIMessage with .content
\`\`\`

### Which to use?
**Almost always use ChatModels.** Modern LLMs (GPT-4, Claude, Gemini) all use the chat interface under the hood. The plain LLM interface is legacy.`,
      },
      {
        id: "p1-s3-t2",
        title: "Building Your First LCEL Chain",
        content: `## Your First LCEL Chain

LCEL (LangChain Expression Language) uses \`|\` to pipe components:

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

llm = ChatOpenAI(model="gpt-4o-mini")

chain = (
    ChatPromptTemplate.from_template("Tell me a joke about {topic}")
    | llm
    | StrOutputParser()
)

result = chain.invoke({"topic": "Python"})
print(result)  # plain string joke
\`\`\`

### How data flows:
1. **Prompt** formats the input dict → \`ChatPromptValue\`
2. **LLM** receives messages → returns \`AIMessage\`
3. **StrOutputParser** extracts \`.content\` → plain \`str\`

This is the fundamental pattern for every LangChain application.`,
      },
    ],
    codeSteps: [
      {
        id: "p1-s3-c1",
        title: "Step 1: Invoke a Chat Model directly",
        instructions: `## Step 1: Your First Chat Model Call

Before building chains, practice calling a ChatModel directly. This shows what \`.invoke()\` returns.

**Your task:**
1. Import \`ChatOpenAI\` and create a model instance
2. Call \`.invoke()\` with a plain string
3. Print the response and its type

You'll see an \`AIMessage\` object — notice the \`.content\` attribute.

> **Note:** In this learning environment, the code runs in a sandbox with a mock LLM. Real API keys aren't required here.`,
        starterCode: `from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage

# Create a chat model (temperature=0 for deterministic output)
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# Invoke with a simple string — LangChain auto-wraps it as a HumanMessage
response = llm.invoke("What is the capital of France?")

print(type(response).__name__)   # AIMessage
print(response.content)          # Paris
print(response.response_metadata.get("model_name"))
`,
        expectedOutput: `AIMessage
Paris
gpt-4o-mini`,
        hint: {
          code: `from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
response = llm.invoke("What is the capital of France?")

print(type(response).__name__)
print(response.content)
print(response.response_metadata.get("model_name"))
`,
          explanation:
            "ChatOpenAI wraps OpenAI's chat completions API. `.invoke()` accepts a string, a list of messages, or a `ChatPromptValue`. It returns an `AIMessage`. The `temperature=0` setting makes outputs deterministic.",
        },
      },
      {
        id: "p1-s3-c2",
        title: "Step 2: Build a full LCEL chain",
        instructions: `## Step 2: Prompt | LLM | Parser

Now wire together: **prompt template → chat model → output parser**.

This is the fundamental LangChain pattern you'll use in every project.

**Your task:**
1. Create a \`ChatPromptTemplate\` with a system + human message
2. Create a \`ChatOpenAI\` model
3. Create a \`StrOutputParser\`
4. Chain them with \`|\`
5. Invoke with a topic and print the result`,
        starterCode: `from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# 1. Prompt
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a concise technical writer."),
    ("human", "Summarize {topic} in one sentence."),
])

# 2. Model
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

# 3. Parser
parser = StrOutputParser()

# 4. Chain with pipe operator
chain = prompt | llm | parser

# 5. Invoke
result = chain.invoke({"topic": "Python decorators"})
print(result)
`,
        expectedOutput:
          "Python decorators are functions that wrap other functions to extend or modify their behavior without permanently changing them.",
        hint: {
          code: `from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a concise technical writer."),
    ("human", "Summarize {topic} in one sentence."),
])

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
parser = StrOutputParser()

chain = prompt | llm | parser
result = chain.invoke({"topic": "Python decorators"})
print(result)
`,
          explanation:
            "The `|` operator calls `__or__` on LangChain Runnables — it creates a `RunnableSequence`. Data flows left to right: dict → prompt formats it → llm runs it → parser extracts the string. `StrOutputParser` simply returns `msg.content`.",
        },
      },
    ],
    quiz: [
      {
        id: "p1-s3-q1",
        question: "What does StrOutputParser do in an LCEL chain?",
        options: [
          "Formats the prompt into a string",
          "Extracts .content from an AIMessage into a plain string",
          "Validates that the LLM output is a string",
          "Converts the user input to lowercase",
        ],
        correctIndex: 1,
        explanation:
          "`StrOutputParser` extracts `.content` from an `AIMessage`, turning the structured message object into a plain Python string.",
      },
      {
        id: "p1-s3-q2",
        question: "What does the `|` operator do in LangChain?",
        options: [
          "Compares two runnables",
          "Merges two dicts",
          "Chains runnables into a RunnableSequence",
          "Runs two chains in parallel",
        ],
        correctIndex: 2,
        explanation:
          "The `|` operator creates a `RunnableSequence` — each component's output becomes the next component's input.",
      },
      {
        id: "p1-s3-q3",
        question:
          "Which model interface should you prefer in modern LangChain?",
        options: [
          "LLM (text-in, text-out) for simplicity",
          "ChatModel (messages-in, message-out) for modern APIs",
          "It doesn't matter — they're identical",
          "AsyncLLM for all production use cases",
        ],
        correctIndex: 1,
        explanation:
          "Chat Models are the modern standard — all leading LLMs (GPT-4, Claude, Gemini) use the chat interface. The legacy LLM interface is for older completion-style APIs.",
      },
    ],
    qna: [
      {
        id: "p1-s3-qa1",
        question:
          "What is the difference between .invoke(), .stream(), and .batch()?",
        answer:
          "`.invoke()` runs once and returns the full result. `.stream()` yields tokens as they're generated (great for UI). `.batch()` runs the same chain on a list of inputs in parallel.",
      },
      {
        id: "p1-s3-qa2",
        question: "How do I control the randomness of the model's output?",
        answer:
          "Use the `temperature` parameter: `0` = deterministic (best for structured tasks), `0.7` = balanced, `1.0+` = creative/random. For production code that needs predictable output, always set `temperature=0`.",
      },
    ],
    codingProblem: {
      id: "p1-s3-cp1",
      title: "Multi-Language Explainer Chain",
      prompt: `## Build a Language-Aware Explainer

Create an LCEL chain that:
1. Takes \`concept\` and \`language\` as inputs
2. Has a system message: "You are a {language} programming teacher. Be brief."
3. Has a human message: "Explain {concept} with a short code example."
4. Uses \`ChatOpenAI(model="gpt-4o-mini", temperature=0)\`
5. Parses output to a plain string

Call the chain with \`concept="list comprehension"\` and \`language="Python"\` and print the result.`,
      starterCode: `from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# Build your chain here
chain = ...

result = chain.invoke({
    "concept": "list comprehension",
    "language": "Python",
})
print(result)
`,
      expectedOutput: `A list comprehension builds a new list by applying an expression to each item in an iterable.

\`\`\`python
squares = [x**2 for x in range(5)]
# [0, 1, 4, 9, 16]
\`\`\``,
      hint: {
        code: `from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a {language} programming teacher. Be brief."),
    ("human", "Explain {concept} with a short code example."),
])

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
parser = StrOutputParser()

chain = prompt | llm | parser

result = chain.invoke({
    "concept": "list comprehension",
    "language": "Python",
})
print(result)
`,
        explanation:
          "This is the canonical LangChain pattern: ChatPromptTemplate | ChatOpenAI | StrOutputParser. All variables in the template must appear as keys in `.invoke()`.",
      },
    },
  },

  // ── Session 1.4: Memory and Conversation ─────────────────────────────────
  {
    id: "p1-s4",
    phaseId: "phase-1",
    title: "Memory and Conversation History",
    description:
      "Add conversation memory to your chains so the AI remembers previous messages.",
    type: "code",
    estimatedMinutes: 40,
    theorySteps: [
      {
        id: "p1-s4-t1",
        title: "The Stateless Problem",
        content: `## The Stateless Problem

LLMs have no memory by default. Each call is completely independent:

\`\`\`python
chain.invoke("My name is Arjun.")
chain.invoke("What is my name?")  # → "I don't know your name"
\`\`\`

To build a chatbot, you must **manually pass conversation history** on every call.

### The Solution: MessagesPlaceholder

\`\`\`python
from langchain_core.prompts import MessagesPlaceholder

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant."),
    MessagesPlaceholder("history"),  # inject history here
    ("human", "{input}"),
])
\`\`\`

You maintain a list of messages and pass it as \`history\` on each call.`,
      },
      {
        id: "p1-s4-t2",
        title: "RunnableWithMessageHistory",
        content: `## RunnableWithMessageHistory

Manually managing a message list works, but LangChain provides \`RunnableWithMessageHistory\` to automate this:

\`\`\`python
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory

store = {}

def get_session_history(session_id: str):
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

with_history = RunnableWithMessageHistory(
    chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="history",
)

# Session 1 — remembers across calls
with_history.invoke({"input": "My name is Priya"}, config={"configurable": {"session_id": "abc"}})
with_history.invoke({"input": "What is my name?"}, config={"configurable": {"session_id": "abc"}})
# → "Your name is Priya"
\`\`\``,
      },
    ],
    codeSteps: [
      {
        id: "p1-s4-c1",
        title: "Step 1: Manual conversation history",
        instructions: `## Step 1: Pass History Manually

The simplest approach — maintain a list and pass it every call.

**Your task:**
1. Build a chain with \`MessagesPlaceholder("history")\`
2. Create an empty \`history\` list
3. Run two turns of conversation
4. After each turn, append the human + AI messages to history`,
        starterCode: `from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage, AIMessage

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant."),
    MessagesPlaceholder("history"),
    ("human", "{input}"),
])

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
chain = prompt | llm | StrOutputParser()

history = []

# Turn 1
response1 = chain.invoke({"input": "My name is Rahul.", "history": history})
history.append(HumanMessage("My name is Rahul."))
history.append(AIMessage(response1))
print("Turn 1:", response1)

# Turn 2 — chain should remember the name
response2 = chain.invoke({"input": "What is my name?", "history": history})
print("Turn 2:", response2)
`,
        expectedOutput: `Turn 1: Nice to meet you, Rahul! How can I help you today?
Turn 2: Your name is Rahul.`,
        hint: {
          code: `from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage, AIMessage

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant."),
    MessagesPlaceholder("history"),
    ("human", "{input}"),
])

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
chain = prompt | llm | StrOutputParser()

history = []

response1 = chain.invoke({"input": "My name is Rahul.", "history": history})
history.append(HumanMessage("My name is Rahul."))
history.append(AIMessage(response1))
print("Turn 1:", response1)

response2 = chain.invoke({"input": "What is my name?", "history": history})
print("Turn 2:", response2)
`,
          explanation:
            "`MessagesPlaceholder` injects the history list between the system message and the current human input. You manually append `HumanMessage` and `AIMessage` objects after each turn to build up the context.",
        },
      },
    ],
    quiz: [
      {
        id: "p1-s4-q1",
        question: "Why does a basic LangChain chain forget previous messages?",
        options: [
          "LangChain has a bug",
          "LLMs are stateless — each call is independent",
          "Memory is disabled by default and must be enabled",
          "The LLM API rate-limits history",
        ],
        correctIndex: 1,
        explanation:
          "LLMs are fundamentally stateless — they only see what you send in the current API call. It's the application's job to maintain and pass conversation history.",
      },
      {
        id: "p1-s4-q2",
        question: "What does MessagesPlaceholder do in a ChatPromptTemplate?",
        options: [
          "Creates a placeholder text in the output",
          "Reserves a slot to inject a dynamic list of messages into the prompt",
          "Marks a message as optional",
          "Stores messages in a database",
        ],
        correctIndex: 1,
        explanation:
          "`MessagesPlaceholder` creates a named slot in the template where you inject a list of `BaseMessage` objects at runtime.",
      },
    ],
    qna: [
      {
        id: "p1-s4-qa1",
        question: "How much history should I pass to the LLM?",
        answer:
          "Only as much as fits in the context window (minus your prompt and expected response). For GPT-4o-mini with a 128k token window, you can pass hundreds of messages. In practice, most apps use a sliding window of the last 10-20 turns or summarize older messages.",
      },
      {
        id: "p1-s4-qa2",
        question: "Where should I store conversation history in production?",
        answer:
          "In a database keyed by session ID. LangChain has built-in integrations for Redis, PostgreSQL, MongoDB, DynamoDB, and more via `langchain-community`. For this course, we use in-memory storage.",
      },
    ],
    codingProblem: {
      id: "p1-s4-cp1",
      title: "3-Turn Memory Chain",
      prompt: `## Build a 3-Turn Conversation

Create a chain with \`MessagesPlaceholder\` that maintains history across 3 turns:
- Turn 1: "I love programming in Python."
- Turn 2: "What language did I say I love?"
- Turn 3: "Tell me one tip for that language."

Print each AI response. The AI should reference prior turns correctly.`,
      starterCode: `from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage, AIMessage

# Build your memory chain here
`,
      expectedOutput: `Turn 1: That's great! Python is a wonderful language with a clean syntax and a huge ecosystem.
Turn 2: You said you love programming in Python!
Turn 3: Here's a tip: use list comprehensions instead of loops for cleaner, more Pythonic code.`,
      hint: {
        code: `from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage, AIMessage

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful programming assistant."),
    MessagesPlaceholder("history"),
    ("human", "{input}"),
])

chain = prompt | ChatOpenAI(model="gpt-4o-mini", temperature=0) | StrOutputParser()
history = []

def chat(user_input: str) -> str:
    response = chain.invoke({"input": user_input, "history": history})
    history.append(HumanMessage(user_input))
    history.append(AIMessage(response))
    return response

print("Turn 1:", chat("I love programming in Python."))
print("Turn 2:", chat("What language did I say I love?"))
print("Turn 3:", chat("Tell me one tip for that language."))
`,
        explanation:
          "Wrapping the chat loop in a helper function keeps the code clean. The `history` list grows with each turn — pass it as `history` to `chain.invoke()` every time.",
      },
    },
  },

  // ── Session 1.5: Output Parsers ───────────────────────────────────────────
  {
    id: "p1-s5",
    phaseId: "phase-1",
    title: "Output Parsers and Structured Output",
    description:
      "Extract structured data (JSON, Pydantic models) from LLM responses instead of raw strings.",
    type: "code",
    estimatedMinutes: 45,
    theorySteps: [
      {
        id: "p1-s5-t1",
        title: "Why Structured Output?",
        content: `## Why Structured Output?

Plain text responses are fine for chatbots, but real apps need **typed data**:

- A code review that returns \`{"severity": "high", "issues": [...]}\`
- A product extractor that returns a list of \`Product\` objects
- A routing decision that returns \`{"next_step": "search" | "answer" | "escalate"}\`

Without structure, you're stuck parsing free text — fragile and error-prone.

### LangChain's Approach

1. **StrOutputParser** — plain string (you've used this)
2. **JsonOutputParser** — parses LLM output as JSON
3. **PydanticOutputParser** — validates output against a Pydantic model
4. **with_structured_output()** — model-native structured output (best for OpenAI)`,
      },
      {
        id: "p1-s5-t2",
        title: "with_structured_output()",
        content: `## with_structured_output() — The Modern Way

OpenAI's API supports JSON Schema and function calling for structured output. LangChain wraps this:

\`\`\`python
from pydantic import BaseModel, Field
from langchain_openai import ChatOpenAI

class MovieReview(BaseModel):
    title: str = Field(description="Movie title")
    rating: int = Field(description="Rating from 1-10")
    summary: str = Field(description="One-sentence summary")

llm = ChatOpenAI(model="gpt-4o-mini")
structured_llm = llm.with_structured_output(MovieReview)

review = structured_llm.invoke("Review the movie Inception")
print(review.title)   # "Inception"
print(review.rating)  # 9
print(type(review))   # <class 'MovieReview'>
\`\`\`

This is **far more reliable** than asking the LLM to "respond in JSON" in the prompt.`,
      },
    ],
    codeSteps: [
      {
        id: "p1-s5-c1",
        title: "Step 1: Parse JSON output",
        instructions: `## Step 1: JSON Output Parser

Use \`JsonOutputParser\` to make the LLM return a Python dict.

**Your task:**
1. Import \`JsonOutputParser\`
2. Create a chain: prompt | llm | parser
3. Include format instructions in the prompt
4. Parse a book recommendation into a dict with title, author, year`,
        starterCode: `from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

parser = JsonOutputParser()

prompt = ChatPromptTemplate.from_messages([
    ("system", "Return valid JSON only. No extra text."),
    ("human", "Recommend a Python programming book. Return: {{\"title\": ..., \"author\": ..., \"year\": ...}}"),
])

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
chain = prompt | llm | parser

result = chain.invoke({})
print(type(result))        # <class 'dict'>
print(result["title"])
print(result["author"])
print(result["year"])
`,
        expectedOutput: `<class 'dict'>
Fluent Python
Luciano Ramalho
2022`,
        hint: {
          code: `from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

parser = JsonOutputParser()

prompt = ChatPromptTemplate.from_messages([
    ("system", "Return valid JSON only. No extra text."),
    ("human", "Recommend a Python programming book. Return: {{\"title\": ..., \"author\": ..., \"year\": ...}}"),
])

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
chain = prompt | llm | parser

result = chain.invoke({})
print(type(result))
print(result["title"])
print(result["author"])
print(result["year"])
`,
          explanation:
            "`JsonOutputParser` calls `json.loads()` on the model's string output. Double curly braces `{{` in the template escape to literal `{` — important because single `{` is a template variable.",
        },
      },
      {
        id: "p1-s5-c2",
        title: "Step 2: Pydantic structured output",
        instructions: `## Step 2: with_structured_output()

Use Pydantic + \`with_structured_output()\` for type-safe, validated output.

**Your task:**
1. Define a \`BookInfo\` Pydantic model with fields: title (str), author (str), year (int), genre (str)
2. Create a structured LLM with \`llm.with_structured_output(BookInfo)\`
3. Invoke it and access typed fields`,
        starterCode: `from pydantic import BaseModel, Field
from langchain_openai import ChatOpenAI

class BookInfo(BaseModel):
    title: str = Field(description="Book title")
    author: str = Field(description="Author full name")
    year: int = Field(description="Publication year")
    genre: str = Field(description="Genre e.g. technical, fiction")

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
structured_llm = llm.with_structured_output(BookInfo)

book = structured_llm.invoke("Tell me about 'Clean Code' by Robert Martin")
print(book.title)
print(book.author)
print(book.year)
print(book.genre)
print(type(book))
`,
        expectedOutput: `Clean Code
Robert C. Martin
2008
technical
<class '__main__.BookInfo'>`,
        hint: {
          code: `from pydantic import BaseModel, Field
from langchain_openai import ChatOpenAI

class BookInfo(BaseModel):
    title: str = Field(description="Book title")
    author: str = Field(description="Author full name")
    year: int = Field(description="Publication year")
    genre: str = Field(description="Genre e.g. technical, fiction")

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
structured_llm = llm.with_structured_output(BookInfo)

book = structured_llm.invoke("Tell me about 'Clean Code' by Robert Martin")
print(book.title)
print(book.author)
print(book.year)
print(book.genre)
print(type(book))
`,
          explanation:
            "`with_structured_output(Model)` uses OpenAI's JSON schema enforcement to guarantee the response matches your Pydantic model. Fields are validated automatically — if the model returns the wrong type, Pydantic raises a `ValidationError`.",
        },
      },
    ],
    quiz: [
      {
        id: "p1-s5-q1",
        question:
          "What is the advantage of with_structured_output() over JsonOutputParser?",
        options: [
          "It's faster to write",
          "It uses model-native JSON enforcement, so output is more reliable",
          "It works with all LLM providers",
          "It doesn't require Pydantic",
        ],
        correctIndex: 1,
        explanation:
          "`with_structured_output()` uses OpenAI's JSON Schema enforcement at the API level — the model is constrained to produce valid JSON matching your schema, not just asked nicely in the prompt.",
      },
      {
        id: "p1-s5-q2",
        question:
          "What does Field(description=...) do in a Pydantic model used with LangChain?",
        options: [
          "Adds a comment to the Python code",
          "Validates that the value matches a regex",
          "Provides the LLM with context about what to put in that field",
          "Sets a default value",
        ],
        correctIndex: 2,
        explanation:
          "When LangChain converts a Pydantic model to a JSON Schema, `description` becomes the description of each field in the schema — this tells the LLM exactly what value to generate.",
      },
    ],
    qna: [
      {
        id: "p1-s5-qa1",
        question:
          "What happens if the LLM returns invalid JSON when using JsonOutputParser?",
        answer:
          "It raises an `OutputParserException`. You can use `RetryOutputParser` or `OutputFixingParser` to automatically retry with the error message included, asking the LLM to fix its output.",
      },
    ],
    codingProblem: {
      id: "p1-s5-cp1",
      title: "Code Review Extractor",
      prompt: `## Build a Structured Code Reviewer

Create a chain that reviews code and returns structured output.

Define a \`CodeReview\` Pydantic model with:
- \`severity\`: Literal["low", "medium", "high"]
- \`issues\`: list[str] — list of problems found
- \`suggestions\`: list[str] — improvement suggestions
- \`score\`: int — quality score 1-10

Use \`with_structured_output(CodeReview)\` and invoke it with this code:

\`\`\`python
def add(a, b):
    return a + b
x = add(1, '2')
\`\`\`

Print all fields.`,
      starterCode: `from pydantic import BaseModel, Field
from typing import Literal
from langchain_openai import ChatOpenAI

# Define CodeReview model here

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
# Create structured_llm and invoke here
`,
      expectedOutput: `Severity: medium
Issues: ['Type mismatch: adding int and str will raise TypeError', 'Missing type annotations']
Suggestions: ['Add type hints', 'Validate input types', 'Add error handling']
Score: 5`,
      hint: {
        code: `from pydantic import BaseModel, Field
from typing import Literal
from langchain_openai import ChatOpenAI

class CodeReview(BaseModel):
    severity: Literal["low", "medium", "high"] = Field(description="Overall severity of issues")
    issues: list[str] = Field(description="List of problems found in the code")
    suggestions: list[str] = Field(description="Improvement suggestions")
    score: int = Field(description="Code quality score from 1 to 10")

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
structured_llm = llm.with_structured_output(CodeReview)

code = """
def add(a, b):
    return a + b
x = add(1, '2')
"""

review = structured_llm.invoke(f"Review this Python code:\\n{code}")
print(f"Severity: {review.severity}")
print(f"Issues: {review.issues}")
print(f"Suggestions: {review.suggestions}")
print(f"Score: {review.score}")
`,
        explanation:
          "`Literal['low', 'medium', 'high']` constrains the field to specific string values — Pydantic validates this at runtime. `list[str]` tells the schema to expect a JSON array of strings.",
      },
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 2 — LangGraph Fundamentals
// ═══════════════════════════════════════════════════════════════════════════════

const phase2Sessions: Session[] = [
  // ── Session 2.1: Introduction to LangGraph ────────────────────────────────
  {
    id: "p2-s1",
    phaseId: "phase-2",
    title: "Introduction to LangGraph",
    description:
      "Understand why LangGraph exists and when to use graphs over simple chains.",
    type: "theory",
    estimatedMinutes: 25,
    theorySteps: [
      {
        id: "p2-s1-t1",
        title: "Beyond Chains: Why LangGraph?",
        content: `## Beyond Chains: Why LangGraph?

LangChain chains are **linear** — data flows in one direction. But real-world AI systems often need:

- **Loops** — retry a step if the output doesn't meet a condition
- **Branching** — take different paths based on the AI's output
- **Parallel execution** — run multiple tasks simultaneously
- **Human-in-the-loop** — pause and wait for user approval

This is where **LangGraph** comes in. It models your AI workflow as a **directed graph** where:
- **Nodes** are functions that transform state
- **Edges** are connections between nodes (can be conditional)
- **State** is a typed dict that flows through the entire graph`,
      },
      {
        id: "p2-s1-t2",
        title: "Graph vs Chain: When to Use Each",
        content: `## Graph vs Chain: When to Use Each

| Situation | Use |
|---|---|
| Simple prompt → response | Chain (LCEL) |
| Multi-step with fixed order | Chain (LCEL) |
| Retry logic or loops | LangGraph |
| Conditional routing ("if X, do Y") | LangGraph |
| Parallel tool calls | LangGraph |
| Human approval required | LangGraph |
| Multi-agent systems | LangGraph |

### The Key Mental Model

A LangGraph graph is like a **state machine**:
- You define all possible states (TypedDict)
- Nodes read from state and return updates
- Edges decide which node to visit next
- The graph runs until it reaches END`,
      },
      {
        id: "p2-s1-t3",
        title: "Your First Graph Concept",
        content: `## Your First Graph Concept

\`\`\`python
from langgraph.graph import StateGraph, END
from typing import TypedDict

class State(TypedDict):
    messages: list[str]
    result: str

def process_node(state: State) -> dict:
    # Read from state, return updates
    return {"result": "processed"}

# Build the graph
builder = StateGraph(State)
builder.add_node("process", process_node)
builder.set_entry_point("process")
builder.add_edge("process", END)

graph = builder.compile()
output = graph.invoke({"messages": ["hello"], "result": ""})
\`\`\`

### Key concepts:
- **StateGraph(State)** — creates a graph with typed state
- **add_node("name", fn)** — registers a function as a node
- **set_entry_point("name")** — which node runs first
- **add_edge(A, B)** — A always goes to B
- **compile()** — validates and locks the graph
- **invoke(initial_state)** — runs the graph`,
      },
    ],
    codeSteps: [],
    quiz: [
      {
        id: "p2-s1-q1",
        question:
          "What is the primary advantage of LangGraph over LCEL chains?",
        options: [
          "Faster execution",
          "Cheaper API calls",
          "Support for loops, branching, and stateful workflows",
          "Better prompt formatting",
        ],
        correctIndex: 2,
        explanation:
          "LangGraph supports cycles (loops), conditional edges (branching), and persistent state — none of which are possible with linear LCEL chains.",
      },
      {
        id: "p2-s1-q2",
        question: "In LangGraph, what does a Node do?",
        options: [
          "Stores the graph's state permanently",
          "Connects two other nodes",
          "A function that reads from state and returns state updates",
          "Terminates the graph execution",
        ],
        correctIndex: 2,
        explanation:
          "A node is any Python function that takes the current `State` dict and returns a dict of updates to merge into the state.",
      },
      {
        id: "p2-s1-q3",
        question: "What does `builder.compile()` do?",
        options: [
          "Compiles Python code to bytecode",
          "Validates the graph structure and returns a runnable Pregel graph",
          "Connects the graph to an LLM",
          "Locks the state so it can't be changed",
        ],
        correctIndex: 1,
        explanation:
          "`compile()` validates that all nodes are connected, entry points are set, and edges are valid — then returns a `CompiledStateGraph` that you can `.invoke()`, `.stream()`, or `.batch()`.",
      },
    ],
    qna: [
      {
        id: "p2-s1-qa1",
        question: "What is Pregel and why does LangGraph use it?",
        answer:
          "Pregel is a graph computation model from Google that processes nodes in 'supersteps'. LangGraph uses it to enable parallel node execution, checkpointing, and streaming — the compiled graph is a Pregel execution engine.",
      },
      {
        id: "p2-s1-qa2",
        question: "Can I mix LangGraph and LCEL?",
        answer:
          "Absolutely. Nodes in a LangGraph graph can themselves be LCEL chains. You get the composability of LCEL for individual steps and the control flow power of LangGraph for the overall workflow.",
      },
      {
        id: "p2-s1-qa3",
        question: "Is LangGraph only for multi-agent systems?",
        answer:
          "No — even single-agent workflows benefit from LangGraph when they need loops, human-in-the-loop pauses, or complex branching. The multi-agent use case is just the most compelling example.",
      },
    ],
    codingProblem: null,
  },

  // ── Session 2.2: State and Nodes ─────────────────────────────────────────
  {
    id: "p2-s2",
    phaseId: "phase-2",
    title: "State, Nodes, and Edges",
    description:
      "Build graphs with typed state, multiple nodes, and edges that connect them.",
    type: "code",
    estimatedMinutes: 50,
    theorySteps: [
      {
        id: "p2-s2-t1",
        title: "Designing Your State",
        content: `## Designing Your State

State is the shared memory that all nodes read from and write to. Define it as a \`TypedDict\`:

\`\`\`python
from typing import TypedDict, Annotated
from langchain_core.messages import BaseMessage
import operator

class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], operator.add]  # append, not replace
    query: str
    answer: str
    step_count: int
\`\`\`

### Annotated Reducers

By default, nodes **replace** state fields. Use \`Annotated[list, operator.add]\` to make a list field **append** instead:

\`\`\`python
# Node returns {"messages": [new_msg]}
# operator.add reducer: state["messages"] += [new_msg]
\`\`\`

This is essential for conversation history — you want to add messages, not replace the whole list.`,
      },
    ],
    codeSteps: [
      {
        id: "p2-s2-c1",
        title: "Step 1: Build a 3-node pipeline",
        instructions: `## Step 1: Three Nodes, Two Edges

Build a graph that processes a query through 3 nodes:
1. **classify** — classifies the query as "simple" or "complex"  
2. **answer** — generates an answer
3. **format** — formats the answer nicely

**Your task:**
Build the graph, add nodes, connect them with edges, compile and invoke.`,
        starterCode: `from langgraph.graph import StateGraph, END
from typing import TypedDict

class State(TypedDict):
    query: str
    classification: str
    answer: str
    final_output: str

def classify_node(state: State) -> dict:
    query = state["query"]
    classification = "simple" if len(query.split()) < 5 else "complex"
    return {"classification": classification}

def answer_node(state: State) -> dict:
    query = state["query"]
    classification = state["classification"]
    answer = f"[{classification.upper()}] Answering: {query}"
    return {"answer": answer}

def format_node(state: State) -> dict:
    answer = state["answer"]
    final = f"✅ {answer}"
    return {"final_output": final}

# Build the graph
builder = StateGraph(State)
builder.add_node("classify", classify_node)
builder.add_node("answer", answer_node)
builder.add_node("format", format_node)

# Set entry point and connect edges
builder.set_entry_point("classify")
builder.add_edge("classify", "answer")
builder.add_edge("answer", "format")
builder.add_edge("format", END)

graph = builder.compile()

# Run it
result = graph.invoke({"query": "What is LangGraph?", "classification": "", "answer": "", "final_output": ""})
print(result["classification"])
print(result["final_output"])
`,
        expectedOutput: `complex
✅ [COMPLEX] Answering: What is LangGraph?`,
        hint: {
          code: `from langgraph.graph import StateGraph, END
from typing import TypedDict

class State(TypedDict):
    query: str
    classification: str
    answer: str
    final_output: str

def classify_node(state: State) -> dict:
    query = state["query"]
    classification = "simple" if len(query.split()) < 5 else "complex"
    return {"classification": classification}

def answer_node(state: State) -> dict:
    return {"answer": f"[{state['classification'].upper()}] Answering: {state['query']}"}

def format_node(state: State) -> dict:
    return {"final_output": f"✅ {state['answer']}"}

builder = StateGraph(State)
builder.add_node("classify", classify_node)
builder.add_node("answer", answer_node)
builder.add_node("format", format_node)
builder.set_entry_point("classify")
builder.add_edge("classify", "answer")
builder.add_edge("answer", "format")
builder.add_edge("format", END)

graph = builder.compile()
result = graph.invoke({"query": "What is LangGraph?", "classification": "", "answer": "", "final_output": ""})
print(result["classification"])
print(result["final_output"])
`,
          explanation:
            "Each node function receives the full state dict and returns only the fields it wants to update. The graph merges these partial updates into the state automatically.",
        },
      },
    ],
    quiz: [
      {
        id: "p2-s2-q1",
        question:
          "What does `Annotated[list, operator.add]` do in a LangGraph state field?",
        options: [
          "Makes the field required",
          "Limits the list to one item",
          "Makes nodes append to the list instead of replacing it",
          "Validates that only operators can write to it",
        ],
        correctIndex: 2,
        explanation:
          "The `Annotated` reducer tells LangGraph how to merge state updates. `operator.add` on a list means `state[field] = state[field] + node_output[field]` — append, not replace.",
      },
      {
        id: "p2-s2-q2",
        question: "What does set_entry_point() define?",
        options: [
          "The node where execution starts",
          "The node that ends the graph",
          "The initial state values",
          "The first edge in the graph",
        ],
        correctIndex: 0,
        explanation:
          "`set_entry_point('node_name')` marks which node receives the initial state when `.invoke()` is called.",
      },
    ],
    qna: [
      {
        id: "p2-s2-qa1",
        question:
          "What happens if a node returns a field that doesn't exist in the State TypedDict?",
        answer:
          "LangGraph ignores unknown keys in node return values. Only keys that exist in your State TypedDict are tracked — extra keys are silently dropped.",
      },
    ],
    codingProblem: {
      id: "p2-s2-cp1",
      title: "Text Processing Pipeline",
      prompt: `## Build a 4-Node Text Processor

Create a graph that processes text through 4 nodes:
1. **clean** — strip whitespace from \`text\` field
2. **count** — count words, store in \`word_count\`
3. **summarize** — set \`summary\` to first 5 words + "..."
4. **report** — set \`report\` to "Words: {count} | Preview: {summary}"

State fields: \`text\`, \`word_count\` (int), \`summary\`, \`report\`

Invoke with \`{"text": "  LangGraph is amazing for building AI agents  "}\`
Print the \`report\` field.`,
      starterCode: `from langgraph.graph import StateGraph, END
from typing import TypedDict

class State(TypedDict):
    text: str
    word_count: int
    summary: str
    report: str

# Build 4 nodes and the graph here
`,
      expectedOutput:
        "Words: 7 | Preview: LangGraph is amazing for building...",
      hint: {
        code: `from langgraph.graph import StateGraph, END
from typing import TypedDict

class State(TypedDict):
    text: str
    word_count: int
    summary: str
    report: str

def clean(state: State) -> dict:
    return {"text": state["text"].strip()}

def count(state: State) -> dict:
    return {"word_count": len(state["text"].split())}

def summarize(state: State) -> dict:
    words = state["text"].split()
    return {"summary": " ".join(words[:5]) + "..."}

def report(state: State) -> dict:
    return {"report": f"Words: {state['word_count']} | Preview: {state['summary']}"}

builder = StateGraph(State)
for name, fn in [("clean", clean), ("count", count), ("summarize", summarize), ("report", report)]:
    builder.add_node(name, fn)

builder.set_entry_point("clean")
builder.add_edge("clean", "count")
builder.add_edge("count", "summarize")
builder.add_edge("summarize", "report")
builder.add_edge("report", END)

graph = builder.compile()
result = graph.invoke({"text": "  LangGraph is amazing for building AI agents  ", "word_count": 0, "summary": "", "report": ""})
print(result["report"])
`,
        explanation:
          "Each node only updates its own output fields — other state fields pass through unchanged. The graph merges all partial updates into the running state.",
      },
    },
  },

  // ── Session 2.3: Conditional Routing ─────────────────────────────────────
  {
    id: "p2-s3",
    phaseId: "phase-2",
    title: "Conditional Edges and Routing",
    description:
      "Add branching logic to your graphs using conditional edges and router functions.",
    type: "code",
    estimatedMinutes: 50,
    theorySteps: [
      {
        id: "p2-s3-t1",
        title: "Conditional Edges",
        content: `## Conditional Edges

Static edges (\`add_edge\`) always go to the same next node. **Conditional edges** branch based on state:

\`\`\`python
def route_query(state: State) -> str:
    """Returns the name of the next node to visit."""
    if state["intent"] == "search":
        return "search_node"
    elif state["intent"] == "calculate":
        return "calc_node"
    else:
        return "default_node"

builder.add_conditional_edges(
    "router",           # source node
    route_query,        # function that returns next node name
    {                   # map: returned string → actual node name
        "search_node": "search_node",
        "calc_node": "calc_node",
        "default_node": "default_node",
    }
)
\`\`\`

The router function runs **after** the source node completes and returns a string key from the mapping.`,
      },
    ],
    codeSteps: [
      {
        id: "p2-s3-c1",
        title: "Step 1: Build a conditional router",
        instructions: `## Step 1: Route Based on Query Type

Build a graph that:
1. Classifies a query as "math" or "general"
2. Routes to different answer nodes based on classification

**Nodes:**
- \`classify\` — sets \`query_type\` to "math" if query contains digits, else "general"
- \`math_answer\` — sets answer to "🔢 This is a math question"
- \`general_answer\` — sets answer to "💬 This is a general question"

Use \`add_conditional_edges\` to route from classify.`,
        starterCode: `from langgraph.graph import StateGraph, END
from typing import TypedDict

class State(TypedDict):
    query: str
    query_type: str
    answer: str

def classify(state: State) -> dict:
    has_digits = any(c.isdigit() for c in state["query"])
    return {"query_type": "math" if has_digits else "general"}

def math_answer(state: State) -> dict:
    return {"answer": "🔢 This is a math question"}

def general_answer(state: State) -> dict:
    return {"answer": "💬 This is a general question"}

def router(state: State) -> str:
    return state["query_type"]  # returns "math" or "general"

# Build the graph
builder = StateGraph(State)
builder.add_node("classify", classify)
builder.add_node("math_answer", math_answer)
builder.add_node("general_answer", general_answer)

builder.set_entry_point("classify")
builder.add_conditional_edges(
    "classify",
    router,
    {"math": "math_answer", "general": "general_answer"}
)
builder.add_edge("math_answer", END)
builder.add_edge("general_answer", END)

graph = builder.compile()

r1 = graph.invoke({"query": "What is 5+3?", "query_type": "", "answer": ""})
r2 = graph.invoke({"query": "Who wrote Hamlet?", "query_type": "", "answer": ""})
print(r1["answer"])
print(r2["answer"])
`,
        expectedOutput: `🔢 This is a math question
💬 This is a general question`,
        hint: {
          code: `from langgraph.graph import StateGraph, END
from typing import TypedDict

class State(TypedDict):
    query: str
    query_type: str
    answer: str

def classify(state: State) -> dict:
    has_digits = any(c.isdigit() for c in state["query"])
    return {"query_type": "math" if has_digits else "general"}

def math_answer(state: State) -> dict:
    return {"answer": "🔢 This is a math question"}

def general_answer(state: State) -> dict:
    return {"answer": "💬 This is a general question"}

def router(state: State) -> str:
    return state["query_type"]

builder = StateGraph(State)
builder.add_node("classify", classify)
builder.add_node("math_answer", math_answer)
builder.add_node("general_answer", general_answer)

builder.set_entry_point("classify")
builder.add_conditional_edges("classify", router, {"math": "math_answer", "general": "general_answer"})
builder.add_edge("math_answer", END)
builder.add_edge("general_answer", END)

graph = builder.compile()
r1 = graph.invoke({"query": "What is 5+3?", "query_type": "", "answer": ""})
r2 = graph.invoke({"query": "Who wrote Hamlet?", "query_type": "", "answer": ""})
print(r1["answer"])
print(r2["answer"])
`,
          explanation:
            "The router function runs after `classify` updates state. It reads `state['query_type']` and returns a string that maps to a node name. `add_conditional_edges` registers both the function and the mapping dict.",
        },
      },
    ],
    quiz: [
      {
        id: "p2-s3-q1",
        question: "What does a conditional edge router function return?",
        options: [
          "The new state to use",
          "A boolean (True/False)",
          "A string key that maps to the next node",
          "The name of a state field to check",
        ],
        correctIndex: 2,
        explanation:
          "The router function returns a string, which is looked up in the mapping dict to find the actual node name to route to.",
      },
    ],
    qna: [
      {
        id: "p2-s3-qa1",
        question:
          "Can a conditional edge route back to a previous node (creating a loop)?",
        answer:
          "Yes — this is one of LangGraph's most powerful features. You can route back to an earlier node to retry, refine, or iterate. Just make sure your state includes a counter or termination condition to avoid infinite loops.",
      },
    ],
    codingProblem: {
      id: "p2-s3-cp1",
      title: "3-Way Router",
      prompt: `## Build a 3-Way Intent Router

Create a graph that routes based on message intent:
- If message starts with "search:" → route to \`search_handler\`
- If message starts with "calc:" → route to \`calc_handler\`
- Otherwise → route to \`fallback_handler\`

Each handler sets \`response\` to a descriptive string.
State: \`message\`, \`intent\`, \`response\`

Test with three invocations and print each response.`,
      starterCode: `from langgraph.graph import StateGraph, END
from typing import TypedDict

class State(TypedDict):
    message: str
    intent: str
    response: str

# Build your 3-way router here
`,
      expectedOutput: `🔍 Searching for: langchain docs
🔢 Calculating: 15 * 4
❓ I don't understand: hello there`,
      hint: {
        code: `from langgraph.graph import StateGraph, END
from typing import TypedDict

class State(TypedDict):
    message: str
    intent: str
    response: str

def detect_intent(state: State) -> dict:
    msg = state["message"].lower()
    if msg.startswith("search:"): return {"intent": "search"}
    if msg.startswith("calc:"): return {"intent": "calc"}
    return {"intent": "fallback"}

def search_handler(state: State) -> dict:
    q = state["message"].split(":", 1)[1].strip()
    return {"response": f"🔍 Searching for: {q}"}

def calc_handler(state: State) -> dict:
    expr = state["message"].split(":", 1)[1].strip()
    return {"response": f"🔢 Calculating: {expr}"}

def fallback_handler(state: State) -> dict:
    return {"response": f"❓ I don't understand: {state['message']}"}

def router(state: State) -> str:
    return state["intent"]

builder = StateGraph(State)
builder.add_node("detect", detect_intent)
builder.add_node("search_handler", search_handler)
builder.add_node("calc_handler", calc_handler)
builder.add_node("fallback_handler", fallback_handler)

builder.set_entry_point("detect")
builder.add_conditional_edges("detect", router, {
    "search": "search_handler",
    "calc": "calc_handler",
    "fallback": "fallback_handler",
})
for h in ["search_handler", "calc_handler", "fallback_handler"]:
    builder.add_edge(h, END)

graph = builder.compile()
for msg in ["search: langchain docs", "calc: 15 * 4", "hello there"]:
    r = graph.invoke({"message": msg, "intent": "", "response": ""})
    print(r["response"])
`,
        explanation:
          "The intent detection node runs first and sets `intent`. The router function reads `intent` and returns the matching handler name. Each handler is connected directly to END.",
      },
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 3 — Advanced Patterns
// ═══════════════════════════════════════════════════════════════════════════════

const phase3Sessions: Session[] = [
  // ── Session 3.1: Building Agents ─────────────────────────────────────────
  {
    id: "p3-s1",
    phaseId: "phase-3",
    title: "Building LangGraph Agents",
    description:
      "Create a ReAct agent that reasons and acts using tools in a loop.",
    type: "code",
    estimatedMinutes: 60,
    theorySteps: [
      {
        id: "p3-s1-t1",
        title: "What is an Agent?",
        content: `## What is an Agent?

An **agent** is an LLM that can use tools and decides what to do next based on the results. Unlike chains (which have a fixed order), agents **reason** at each step.

### The ReAct Loop

\`\`\`
Thought: I need to find the current temperature.
Action: search_tool("current temperature London")
Observation: 18°C, partly cloudy
Thought: I have the answer.
Final Answer: It's currently 18°C in London.
\`\`\`

This **Thought → Action → Observation** loop continues until the agent decides it has enough information.

### LangGraph ReAct Agent

LangGraph's \`create_react_agent\` builds this loop for you:

\`\`\`python
from langgraph.prebuilt import create_react_agent
from langchain_openai import ChatOpenAI

agent = create_react_agent(
    model=ChatOpenAI(model="gpt-4o-mini"),
    tools=[search_tool, calc_tool],
)
result = agent.invoke({"messages": [("human", "What is 15% of 240?")]})
\`\`\``,
      },
      {
        id: "p3-s1-t2",
        title: "Defining Tools",
        content: `## Defining Tools

Tools are Python functions with the \`@tool\` decorator:

\`\`\`python
from langchain_core.tools import tool

@tool
def calculate(expression: str) -> str:
    """Evaluate a mathematical expression. Input: math expression as string."""
    try:
        return str(eval(expression))
    except Exception as e:
        return f"Error: {e}"

@tool
def get_weather(city: str) -> str:
    """Get the current weather for a city."""
    # In production, call a weather API
    return f"The weather in {city} is 22°C and sunny."
\`\`\`

### Important Rules for Tools:
1. **Docstring is the prompt** — the LLM reads the docstring to decide when to use the tool
2. **Return strings** — LLMs process text; convert any data to a readable string
3. **Handle errors** — return error messages as strings, never raise exceptions`,
      },
    ],
    codeSteps: [
      {
        id: "p3-s1-c1",
        title: "Step 1: Create your first tool",
        instructions: `## Step 1: Build a Calculator Tool

Create a \`@tool\` function that evaluates math expressions.

**Your task:**
1. Import \`tool\` from \`langchain_core.tools\`
2. Define a \`calculator\` tool with a clear docstring
3. Test it directly (tools are just functions!)
4. Print the result`,
        starterCode: `from langchain_core.tools import tool

@tool
def calculator(expression: str) -> str:
    """Evaluate a mathematical expression and return the result as a string.
    
    Args:
        expression: A valid Python math expression like '2 + 3 * 4' or '100 / 5'
    """
    try:
        result = eval(expression)
        return f"Result: {result}"
    except Exception as e:
        return f"Error evaluating expression: {e}"

# Tools are just functions — test them directly
print(calculator.invoke("15 * 24"))
print(calculator.invoke("100 / 7"))
print(calculator.name)
print(calculator.description)
`,
        expectedOutput: `Result: 360
Result: 14.285714285714286
calculator
Evaluate a mathematical expression and return the result as a string.`,
        hint: {
          code: `from langchain_core.tools import tool

@tool
def calculator(expression: str) -> str:
    """Evaluate a mathematical expression and return the result as a string.
    
    Args:
        expression: A valid Python math expression like '2 + 3 * 4' or '100 / 5'
    """
    try:
        result = eval(expression)
        return f"Result: {result}"
    except Exception as e:
        return f"Error evaluating expression: {e}"

print(calculator.invoke("15 * 24"))
print(calculator.invoke("100 / 7"))
print(calculator.name)
print(calculator.description)
`,
          explanation:
            "The `@tool` decorator wraps your function as a `BaseTool`. `.invoke()` calls the function. `.name` is the function name. `.description` is the first line of the docstring — this is what the LLM reads to decide whether to use the tool.",
        },
      },
      {
        id: "p3-s1-c2",
        title: "Step 2: Create a ReAct agent",
        instructions: `## Step 2: Build a ReAct Agent with Tools

Wire up an agent with \`create_react_agent\` and give it tools to use.

**Your task:**
1. Define 2 tools: calculator + string_length
2. Create a ReAct agent with both tools
3. Ask it a question that requires tool use
4. Print the final message`,
        starterCode: `from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent

@tool
def calculator(expression: str) -> str:
    """Evaluate a mathematical expression. Input should be a valid math expression."""
    try:
        return str(eval(expression))
    except Exception as e:
        return f"Error: {e}"

@tool
def string_length(text: str) -> str:
    """Count the number of characters in a string."""
    return f"The string has {len(text)} characters."

# Create the agent
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
agent = create_react_agent(model=llm, tools=[calculator, string_length])

# Run the agent
result = agent.invoke({
    "messages": [("human", "What is 256 * 13? Then tell me how many characters are in 'LangGraph'.")]
})

# Print the final AI message
final_message = result["messages"][-1]
print(final_message.content)
`,
        expectedOutput: `256 * 13 = 3,328

The word "LangGraph" has 9 characters.`,
        hint: {
          code: `from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent

@tool
def calculator(expression: str) -> str:
    """Evaluate a mathematical expression. Input should be a valid math expression."""
    try:
        return str(eval(expression))
    except Exception as e:
        return f"Error: {e}"

@tool
def string_length(text: str) -> str:
    """Count the number of characters in a string."""
    return f"The string has {len(text)} characters."

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
agent = create_react_agent(model=llm, tools=[calculator, string_length])

result = agent.invoke({
    "messages": [("human", "What is 256 * 13? Then tell me how many characters are in 'LangGraph'.")]
})

print(result["messages"][-1].content)
`,
          explanation:
            "`create_react_agent` builds a full ReAct graph internally. It adds `ToolNode` and `should_continue` conditional edge automatically. The agent calls tools as `ToolMessage` objects in `state['messages']` and iterates until it decides to answer.",
        },
      },
    ],
    quiz: [
      {
        id: "p3-s1-q1",
        question: "What does the docstring of a @tool function do?",
        options: [
          "Documents the code for developers only",
          "Is sent to the LLM as the tool description — it reads this to decide when to use the tool",
          "Sets the tool's name",
          "Defines the input schema",
        ],
        correctIndex: 1,
        explanation:
          "The docstring becomes the tool's `.description` which is injected into the LLM's prompt. A clear, specific docstring dramatically improves tool selection accuracy.",
      },
      {
        id: "p3-s1-q2",
        question: "What is the ReAct pattern?",
        options: [
          "React + TypeScript + LangChain",
          "A pattern where the LLM alternates between reasoning (Thought) and acting (Action → Observation)",
          "A way to stream LLM responses to React components",
          "The recommended way to handle LLM errors",
        ],
        correctIndex: 1,
        explanation:
          "ReAct (Reasoning + Acting) is a prompting strategy where the LLM thinks step-by-step, calls a tool, observes the result, and repeats until it can give a final answer.",
      },
    ],
    qna: [
      {
        id: "p3-s1-qa1",
        question: "How do I prevent an agent from running forever?",
        answer:
          'Set `recursion_limit` on the graph config: `agent.invoke({...}, config={"recursion_limit": 10})`. This limits how many times the ReAct loop can run. LangGraph raises `GraphRecursionError` if the limit is hit.',
      },
      {
        id: "p3-s1-qa2",
        question: "Can agents use async tools?",
        answer:
          "Yes. Define tools as `async def` with `@tool` and use `await agent.ainvoke()`. LangGraph has full async support throughout.",
      },
    ],
    codingProblem: {
      id: "p3-s1-cp1",
      title: "Research Agent",
      prompt: `## Build a Simple Research Agent

Create a ReAct agent with 3 tools:
1. \`get_definition(term: str)\` — returns "Definition of {term}: A key concept in AI."
2. \`list_examples(topic: str)\` — returns "Examples of {topic}: Example A, Example B, Example C."
3. \`summarize(points: str)\` — returns "Summary: {points[:50]}..."

Create the agent and ask: "What is machine learning? Give me examples and summarize."

Print all messages to see the full ReAct loop.`,
      starterCode: `from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent

# Define your 3 tools here

# Create agent and invoke
`,
      expectedOutput: `[HumanMessage] What is machine learning? Give me examples and summarize.
[AIMessage] (tool_call: get_definition)
[ToolMessage] Definition of machine learning: A key concept in AI.
[AIMessage] (tool_call: list_examples)
[ToolMessage] Examples of machine learning: Example A, Example B, Example C.
[AIMessage] (tool_call: summarize)
[ToolMessage] Summary: Machine learning is a key concept in AI...
[AIMessage] Here's what I found about machine learning: ...`,
      hint: {
        code: `from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent

@tool
def get_definition(term: str) -> str:
    """Get the definition of an AI/ML term."""
    return f"Definition of {term}: A key concept in AI."

@tool
def list_examples(topic: str) -> str:
    """Get examples for a given AI/ML topic."""
    return f"Examples of {topic}: Example A, Example B, Example C."

@tool
def summarize(points: str) -> str:
    """Summarize a collection of points into a brief summary."""
    return f"Summary: {points[:50]}..."

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
agent = create_react_agent(model=llm, tools=[get_definition, list_examples, summarize])

result = agent.invoke({"messages": [("human", "What is machine learning? Give me examples and summarize.")]})

for msg in result["messages"]:
    print(f"[{type(msg).__name__}] {msg.content[:80]}")
`,
        explanation:
          "Each message in `result['messages']` shows one step of the ReAct loop: `HumanMessage` (input), `AIMessage` with `tool_calls` (reasoning + action), `ToolMessage` (observation), and finally `AIMessage` (final answer).",
      },
    },
  },

  // ── Session 3.2: Multi-Agent Systems ─────────────────────────────────────
  {
    id: "p3-s2",
    phaseId: "phase-3",
    title: "Multi-Agent Systems",
    description:
      "Orchestrate multiple specialized agents that collaborate to solve complex tasks.",
    type: "code",
    estimatedMinutes: 70,
    theorySteps: [
      {
        id: "p3-s2-t1",
        title: "Why Multiple Agents?",
        content: `## Why Multiple Agents?

A single agent becomes a bottleneck when tasks are complex and multi-domain. **Multi-agent systems** assign specialized roles:

| Agent | Role |
|---|---|
| Orchestrator | Decomposes the task, delegates sub-tasks |
| Researcher | Fetches information from the web or databases |
| Coder | Writes and reviews code |
| Critic | Reviews outputs for quality |

### Patterns

**Supervisor Pattern** — one orchestrator routes tasks to specialists:
\`\`\`
User → Supervisor → [Research Agent | Code Agent | Writer Agent] → Supervisor → User
\`\`\`

**Pipeline Pattern** — agents run in sequence, each building on the previous output.

**Peer Pattern** — agents communicate directly, no central coordinator.`,
      },
      {
        id: "p3-s2-t2",
        title: "Implementing the Supervisor Pattern",
        content: `## Supervisor Pattern in LangGraph

\`\`\`python
from langgraph.graph import StateGraph, END
from typing import TypedDict, Literal

class SupervisorState(TypedDict):
    task: str
    research: str
    code: str
    review: str
    next_agent: str

def supervisor(state: SupervisorState) -> dict:
    """Decides which agent should run next."""
    if not state["research"]:
        return {"next_agent": "researcher"}
    if not state["code"]:
        return {"next_agent": "coder"}
    if not state["review"]:
        return {"next_agent": "reviewer"}
    return {"next_agent": "END"}

def route_to_agent(state: SupervisorState) -> str:
    return state["next_agent"]
\`\`\`

The supervisor reads state to determine what's been done and what's next — delegating to the right specialist at each step.`,
      },
    ],
    codeSteps: [
      {
        id: "p3-s2-c1",
        title: "Step 1: Build a 3-agent pipeline",
        instructions: `## Step 1: Researcher → Writer → Reviewer Pipeline

Build a graph where 3 agents work in sequence:
1. **researcher** — gathers context for the task
2. **writer** — drafts content based on research
3. **reviewer** — provides feedback on the draft

**Your task:**
Implement all three nodes and connect them. Each builds on the previous node's output.`,
        starterCode: `from langgraph.graph import StateGraph, END
from typing import TypedDict

class PipelineState(TypedDict):
    task: str
    research: str
    draft: str
    review: str

def researcher(state: PipelineState) -> dict:
    task = state["task"]
    research = f"Research for '{task}': Key findings: LangGraph uses graphs, nodes, and edges. Released 2024. Built on LangChain."
    return {"research": research}

def writer(state: PipelineState) -> dict:
    research = state["research"]
    draft = f"Draft: Based on research — {research[:60]}... [full article written]"
    return {"draft": draft}

def reviewer(state: PipelineState) -> dict:
    draft = state["draft"]
    review = f"Review: '{draft[:40]}...' looks good. Approved ✅"
    return {"review": review}

# Build the pipeline graph
builder = StateGraph(PipelineState)
builder.add_node("researcher", researcher)
builder.add_node("writer", writer)
builder.add_node("reviewer", reviewer)

builder.set_entry_point("researcher")
builder.add_edge("researcher", "writer")
builder.add_edge("writer", "reviewer")
builder.add_edge("reviewer", END)

graph = builder.compile()

result = graph.invoke({
    "task": "Write about LangGraph",
    "research": "",
    "draft": "",
    "review": "",
})

print("Research:", result["research"][:60])
print("Draft:", result["draft"][:60])
print("Review:", result["review"])
`,
        expectedOutput: `Research: Research for 'Write about LangGraph': Key findings: Lang
Draft: Draft: Based on research — Research for 'Write about LangGrap
Review: Review: 'Draft: Based on research — Research for 'Write ab...' looks good. Approved ✅`,
        hint: {
          code: `from langgraph.graph import StateGraph, END
from typing import TypedDict

class PipelineState(TypedDict):
    task: str
    research: str
    draft: str
    review: str

def researcher(state: PipelineState) -> dict:
    task = state["task"]
    return {"research": f"Research for '{task}': Key findings: LangGraph uses graphs, nodes, and edges. Released 2024. Built on LangChain."}

def writer(state: PipelineState) -> dict:
    return {"draft": f"Draft: Based on research — {state['research'][:60]}... [full article written]"}

def reviewer(state: PipelineState) -> dict:
    return {"review": f"Review: '{state['draft'][:40]}...' looks good. Approved ✅"}

builder = StateGraph(PipelineState)
builder.add_node("researcher", researcher)
builder.add_node("writer", writer)
builder.add_node("reviewer", reviewer)
builder.set_entry_point("researcher")
builder.add_edge("researcher", "writer")
builder.add_edge("writer", "reviewer")
builder.add_edge("reviewer", END)
graph = builder.compile()

result = graph.invoke({"task": "Write about LangGraph", "research": "", "draft": "", "review": ""})
print("Research:", result["research"][:60])
print("Draft:", result["draft"][:60])
print("Review:", result["review"])
`,
          explanation:
            "Each agent reads from previous nodes' outputs via the shared state. This is the pipeline pattern — sequential, each step enriching the state.",
        },
      },
    ],
    quiz: [
      {
        id: "p3-s2-q1",
        question: "In the Supervisor pattern, what is the supervisor's role?",
        options: [
          "Execute all tasks itself",
          "Decompose the task and route sub-tasks to specialist agents",
          "Only handle error recovery",
          "Connect agents to external APIs",
        ],
        correctIndex: 1,
        explanation:
          "The supervisor reads the current state, determines what's been done and what's needed next, then routes to the appropriate specialist agent.",
      },
    ],
    qna: [
      {
        id: "p3-s2-qa1",
        question: "How do agents in different nodes communicate?",
        answer:
          "Through shared state. Every node reads from the same `State` TypedDict and returns updates. This is LangGraph's key design — there's no direct message passing between nodes, only state mutations.",
      },
    ],
    codingProblem: {
      id: "p3-s2-cp1",
      title: "Supervisor Agent System",
      prompt: `## Build a Supervisor-Controlled Multi-Agent System

Create a system with:
- A \`supervisor\` node that sets \`next_agent\` based on what's missing in state
- A \`researcher\` node (populates \`research\`)
- A \`summarizer\` node (populates \`summary\` from research)
- Conditional edges from \`supervisor\` to \`researcher\`, \`summarizer\`, or \`END\`
- After each specialist, route back to \`supervisor\`

State: \`task\`, \`research\`, \`summary\`, \`next_agent\`

Print both \`research\` and \`summary\` after running.`,
      starterCode: `from langgraph.graph import StateGraph, END
from typing import TypedDict

class State(TypedDict):
    task: str
    research: str
    summary: str
    next_agent: str

# Build your supervisor system here
`,
      expectedOutput: `Research: Facts about LangGraph: It's a graph-based framework for stateful AI agents.
Summary: LangGraph = graph-based framework for stateful AI agents. ✅`,
      hint: {
        code: `from langgraph.graph import StateGraph, END
from typing import TypedDict

class State(TypedDict):
    task: str
    research: str
    summary: str
    next_agent: str

def supervisor(state: State) -> dict:
    if not state["research"]:
        return {"next_agent": "researcher"}
    if not state["summary"]:
        return {"next_agent": "summarizer"}
    return {"next_agent": "END"}

def researcher(state: State) -> dict:
    return {"research": f"Facts about {state['task']}: It's a graph-based framework for stateful AI agents."}

def summarizer(state: State) -> dict:
    r = state["research"]
    return {"summary": r.split(": ", 1)[1].replace("It's a", "").strip().capitalize() + " ✅"}

def router(state: State) -> str:
    return state["next_agent"]

builder = StateGraph(State)
builder.add_node("supervisor", supervisor)
builder.add_node("researcher", researcher)
builder.add_node("summarizer", summarizer)

builder.set_entry_point("supervisor")
builder.add_conditional_edges("supervisor", router, {
    "researcher": "researcher",
    "summarizer": "summarizer",
    "END": END,
})
builder.add_edge("researcher", "supervisor")
builder.add_edge("summarizer", "supervisor")

graph = builder.compile()
result = graph.invoke({"task": "LangGraph", "research": "", "summary": "", "next_agent": ""})
print("Research:", result["research"])
print("Summary:", result["summary"])
`,
        explanation:
          "The supervisor runs first and after each specialist. By routing back to the supervisor, you create a loop that continues until all state fields are filled. Routing to `END` terminates execution.",
      },
    },
  },

  // ── Session 3.3: Final Project ────────────────────────────────────────────
  {
    id: "p3-s3",
    phaseId: "phase-3",
    title: "Final Project: AI Research Assistant",
    description:
      "Build a complete AI research assistant that combines everything you've learned: prompts, memory, structured output, and a multi-agent LangGraph workflow.",
    type: "code",
    estimatedMinutes: 90,
    theorySteps: [
      {
        id: "p3-s3-t1",
        title: "Project Overview",
        content: `## Final Project: AI Research Assistant

Congratulations on reaching the final project! You will now combine **everything you've learned** into a single, production-quality application.

### What You'll Build

An AI Research Assistant that:

1. **Accepts a research topic** from the user
2. **Generates sub-questions** to explore the topic thoroughly
3. **Researches each sub-question** using a tool-equipped agent
4. **Synthesizes findings** into a structured report with citations
5. **Saves the report** as a Pydantic model with metadata

### Skills Used

| Skill | Where |
|---|---|
| ChatPromptTemplate | Question generation & synthesis |
| with_structured_output() | Structured report output |
| @tool decorator | Research & search tools |
| LangGraph StateGraph | Multi-step workflow orchestration |
| Conditional edges | Route to synthesis when research complete |
| Memory / MessagesPlaceholder | Conversation follow-up |`,
      },
      {
        id: "p3-s3-t2",
        title: "Architecture Design",
        content: `## Architecture Design

\`\`\`
User Input
    ↓
[generate_questions node]
    → Creates 3-5 sub-questions from the topic
    ↓
[research_loop node] ←──────┐
    → Researches next question │
    → Adds findings to state   │
    → Conditional: more?  ─────┘
    ↓ (no more questions)
[synthesize node]
    → Combines all findings
    → Returns structured ResearchReport
    ↓
[format_output node]
    → Pretty-prints the report
    ↓
END
\`\`\`

### State Design

\`\`\`python
class ResearchState(TypedDict):
    topic: str
    questions: list[str]        # generated sub-questions
    current_q_index: int        # which question we're on
    findings: list[str]         # one finding per question
    report: ResearchReport | None
\`\`\``,
      },
    ],
    codeSteps: [
      {
        id: "p3-s3-c1",
        title: "Step 1: Define State and Pydantic Report Model",
        instructions: `## Step 1: Design the Data Model

Start by defining:
1. \`ResearchReport\` Pydantic model with: \`title\`, \`summary\`, \`key_findings\` (list[str]), \`conclusion\`
2. \`ResearchState\` TypedDict with: \`topic\`, \`questions\`, \`current_q_index\`, \`findings\`, \`report\`

Run the code to verify both models are correct.`,
        starterCode: `from pydantic import BaseModel, Field
from typing import TypedDict

class ResearchReport(BaseModel):
    title: str = Field(description="Report title")
    summary: str = Field(description="Executive summary in 2-3 sentences")
    key_findings: list[str] = Field(description="3-5 key findings from the research")
    conclusion: str = Field(description="Concluding insight and recommendation")

class ResearchState(TypedDict):
    topic: str
    questions: list[str]
    current_q_index: int
    findings: list[str]
    report: ResearchReport | None

# Test: create an empty state
state: ResearchState = {
    "topic": "LangGraph",
    "questions": [],
    "current_q_index": 0,
    "findings": [],
    "report": None,
}
print("State keys:", list(state.keys()))
print("Report fields:", list(ResearchReport.model_fields.keys()))
`,
        expectedOutput: `State keys: ['topic', 'questions', 'current_q_index', 'findings', 'report']
Report fields: ['title', 'summary', 'key_findings', 'conclusion']`,
        hint: {
          code: `from pydantic import BaseModel, Field
from typing import TypedDict

class ResearchReport(BaseModel):
    title: str = Field(description="Report title")
    summary: str = Field(description="Executive summary in 2-3 sentences")
    key_findings: list[str] = Field(description="3-5 key findings from the research")
    conclusion: str = Field(description="Concluding insight and recommendation")

class ResearchState(TypedDict):
    topic: str
    questions: list[str]
    current_q_index: int
    findings: list[str]
    report: ResearchReport | None

state: ResearchState = {
    "topic": "LangGraph",
    "questions": [],
    "current_q_index": 0,
    "findings": [],
    "report": None,
}
print("State keys:", list(state.keys()))
print("Report fields:", list(ResearchReport.model_fields.keys()))
`,
          explanation:
            "`BaseModel.model_fields` is a dict of field names → `FieldInfo` objects. This is how Pydantic v2 exposes schema metadata. The TypedDict state design keeps all mutable data in one place.",
        },
      },
      {
        id: "p3-s3-c2",
        title: "Step 2: Build the complete research graph",
        instructions: `## Step 2: Wire the Full Graph

Now build the complete research pipeline:

1. \`generate_questions\` — creates 3 questions from the topic
2. \`research_question\` — "researches" the current question (mock)
3. \`synthesize\` — builds a ResearchReport from findings
4. Conditional edge: after research, if more questions remain → loop back; else → synthesize

Connect everything and run it on "LangGraph and multi-agent AI".`,
        starterCode: `from pydantic import BaseModel, Field
from typing import TypedDict
from langgraph.graph import StateGraph, END

class ResearchReport(BaseModel):
    title: str = Field(description="Report title")
    summary: str = Field(description="Executive summary")
    key_findings: list[str] = Field(description="Key findings list")
    conclusion: str = Field(description="Concluding insight")

class ResearchState(TypedDict):
    topic: str
    questions: list[str]
    current_q_index: int
    findings: list[str]
    report: ResearchReport | None

def generate_questions(state: ResearchState) -> dict:
    topic = state["topic"]
    questions = [
        f"What is {topic}?",
        f"What are the main use cases of {topic}?",
        f"What are the limitations of {topic}?",
    ]
    return {"questions": questions, "current_q_index": 0}

def research_question(state: ResearchState) -> dict:
    q = state["questions"][state["current_q_index"]]
    finding = f"Finding for '{q}': [Mock research data — key insights discovered]"
    return {
        "findings": state["findings"] + [finding],
        "current_q_index": state["current_q_index"] + 1,
    }

def synthesize(state: ResearchState) -> dict:
    topic = state["topic"]
    findings = state["findings"]
    report = ResearchReport(
        title=f"Research Report: {topic}",
        summary=f"Comprehensive analysis of {topic} across {len(findings)} dimensions.",
        key_findings=findings,
        conclusion=f"{topic} is a transformative technology with broad applications.",
    )
    return {"report": report}

def should_continue(state: ResearchState) -> str:
    if state["current_q_index"] < len(state["questions"]):
        return "research_question"
    return "synthesize"

# Build graph
builder = StateGraph(ResearchState)
builder.add_node("generate_questions", generate_questions)
builder.add_node("research_question", research_question)
builder.add_node("synthesize", synthesize)

builder.set_entry_point("generate_questions")
builder.add_edge("generate_questions", "research_question")
builder.add_conditional_edges("research_question", should_continue, {
    "research_question": "research_question",
    "synthesize": "synthesize",
})
builder.add_edge("synthesize", END)

graph = builder.compile()

result = graph.invoke({
    "topic": "LangGraph and multi-agent AI",
    "questions": [],
    "current_q_index": 0,
    "findings": [],
    "report": None,
})

report = result["report"]
print(f"Title: {report.title}")
print(f"Summary: {report.summary}")
print(f"Findings ({len(report.key_findings)}):")
for f in report.key_findings:
    print(f"  - {f[:60]}")
print(f"Conclusion: {report.conclusion}")
`,
        expectedOutput: `Title: Research Report: LangGraph and multi-agent AI
Summary: Comprehensive analysis of LangGraph and multi-agent AI across 3 dimensions.
Findings (3):
  - Finding for 'What is LangGraph and multi-agent AI?': [Mock
  - Finding for 'What are the main use cases of LangGraph and mul
  - Finding for 'What are the limitations of LangGraph and multi-
Conclusion: LangGraph and multi-agent AI is a transformative technology with broad applications.`,
        hint: {
          code: `# The solution is the full code shown in starterCode above.
# Key insight: the conditional edge routes back to the SAME node (research_question)
# creating a loop. This is only possible with LangGraph — not with LCEL chains.

# The loop runs until current_q_index >= len(questions),
# then routes to synthesize which builds the final structured report.
`,
          explanation:
            "This graph demonstrates LangGraph's most powerful feature: **loops**. `research_question` increments `current_q_index` on each run. `should_continue` checks if we've processed all questions — if not, it routes back to `research_question`. This is a proper cycle in the graph.",
        },
      },
    ],
    quiz: [
      {
        id: "p3-s3-q1",
        question:
          "In the final project, how does the graph know when to stop the research loop?",
        options: [
          "After a fixed number of iterations",
          "When the LLM decides it has enough information",
          "When current_q_index >= len(questions) in the conditional edge router",
          "After a timeout",
        ],
        correctIndex: 2,
        explanation:
          "The `should_continue` router compares `current_q_index` to the length of the questions list. When all questions are researched, it routes to `synthesize` instead of looping back.",
      },
      {
        id: "p3-s3-q2",
        question: "Which LangChain concept does the final project NOT use?",
        options: [
          "ChatPromptTemplate",
          "with_structured_output()",
          "LangGraph StateGraph",
          "WebSocket streaming",
        ],
        correctIndex: 3,
        explanation:
          "WebSocket streaming is not a LangChain concept — it's a transport protocol. LangChain uses `.stream()` for incremental output, but that's HTTP-level streaming.",
      },
    ],
    qna: [
      {
        id: "p3-s3-qa1",
        question: "How would I add real web search to this project?",
        answer:
          "Replace the mock `research_question` node with an agent that uses `TavilySearchResults` from `langchain-community`. Add it as a `@tool` and use `create_react_agent` inside the node.",
      },
      {
        id: "p3-s3-qa2",
        question:
          "How do I add checkpointing so the graph can be paused and resumed?",
        answer:
          "Use `MemorySaver` or `SqliteSaver` as a checkpointer: `graph = builder.compile(checkpointer=MemorySaver())`. Then pass a `thread_id` in the config. The graph state is saved after every node and can be resumed from any point.",
      },
      {
        id: "p3-s3-qa3",
        question: "What's the next step after completing this course?",
        answer:
          "Build a real project that connects to actual APIs: use `TavilySearchResults` for web search, `ChatOpenAI` with your key for real LLM calls, `SqliteSaver` for persistence, and deploy with FastAPI + LangServe.",
      },
    ],
    codingProblem: {
      id: "p3-s3-cp1",
      title: "Add a Follow-Up Q&A Node",
      prompt: `## Extend the Research Assistant

Add a \`followup_qa\` node to the final project graph that:
1. Takes the completed \`report\` from state
2. Generates 3 follow-up questions based on the report title
3. Stores them in a new state field \`followup_questions\` (list[str])
4. Runs after \`synthesize\` before \`END\`

Add \`followup_questions: list[str]\` to the state.
Print the follow-up questions after running.`,
      starterCode: `# Extend the ResearchState TypedDict and add the followup_qa node
# to the graph from the previous step.
# Your additions:
# 1. Add followup_questions: list[str] to ResearchState
# 2. Define followup_qa(state) -> dict
# 3. Add it to the graph between synthesize and END

from pydantic import BaseModel, Field
from typing import TypedDict
from langgraph.graph import StateGraph, END

# Your extended implementation here
`,
      expectedOutput: `Follow-up Questions:
  1. How does LangGraph and multi-agent AI compare to alternatives?
  2. What are real-world case studies of LangGraph and multi-agent AI?
  3. What is the future roadmap for LangGraph and multi-agent AI?`,
      hint: {
        code: `from pydantic import BaseModel, Field
from typing import TypedDict
from langgraph.graph import StateGraph, END

class ResearchReport(BaseModel):
    title: str = Field(description="Report title")
    summary: str = Field(description="Executive summary")
    key_findings: list[str] = Field(description="Key findings list")
    conclusion: str = Field(description="Concluding insight")

class ResearchState(TypedDict):
    topic: str
    questions: list[str]
    current_q_index: int
    findings: list[str]
    report: ResearchReport | None
    followup_questions: list[str]  # NEW

def generate_questions(state: ResearchState) -> dict:
    topic = state["topic"]
    return {"questions": [f"What is {topic}?", f"Use cases of {topic}?", f"Limits of {topic}?"], "current_q_index": 0}

def research_question(state: ResearchState) -> dict:
    q = state["questions"][state["current_q_index"]]
    return {"findings": state["findings"] + [f"Finding for '{q}': [Mock data]"], "current_q_index": state["current_q_index"] + 1}

def synthesize(state: ResearchState) -> dict:
    report = ResearchReport(title=f"Research Report: {state['topic']}", summary=f"Analysis of {state['topic']}.", key_findings=state["findings"], conclusion=f"{state['topic']} is transformative.")
    return {"report": report}

def followup_qa(state: ResearchState) -> dict:  # NEW
    title = state["report"].title.replace("Research Report: ", "")
    qs = [f"How does {title} compare to alternatives?", f"What are real-world case studies of {title}?", f"What is the future roadmap for {title}?"]
    return {"followup_questions": qs}

def should_continue(state: ResearchState) -> str:
    return "research_question" if state["current_q_index"] < len(state["questions"]) else "synthesize"

builder = StateGraph(ResearchState)
for name, fn in [("generate_questions", generate_questions), ("research_question", research_question), ("synthesize", synthesize), ("followup_qa", followup_qa)]:
    builder.add_node(name, fn)

builder.set_entry_point("generate_questions")
builder.add_edge("generate_questions", "research_question")
builder.add_conditional_edges("research_question", should_continue, {"research_question": "research_question", "synthesize": "synthesize"})
builder.add_edge("synthesize", "followup_qa")
builder.add_edge("followup_qa", END)

graph = builder.compile()
result = graph.invoke({"topic": "LangGraph and multi-agent AI", "questions": [], "current_q_index": 0, "findings": [], "report": None, "followup_questions": []})
print("Follow-up Questions:")
for i, q in enumerate(result["followup_questions"], 1):
    print(f"  {i}. {q}")
`,
        explanation:
          "Adding a new node after `synthesize` is as simple as `builder.add_edge('synthesize', 'followup_qa')` and `builder.add_edge('followup_qa', END)`. The new node reads from `state['report']` which was set by `synthesize`.",
      },
    },
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PHASES
// ═══════════════════════════════════════════════════════════════════════════════

export const phases: Phase[] = [
  {
    id: "phase-1",
    title: "AI Foundations",
    subtitle: "Master the Foundations",
    description:
      "Learn the core building blocks of LangChain: prompt templates, LLMs, chains, memory, and output parsers. By the end you'll be able to build sophisticated LLM pipelines.",
    color: "from-blue-500 to-cyan-400",
    icon: "🧠",
    order: 1,
    sessions: phase1Sessions,
  },
  {
    id: "phase-2",
    title: "LangGraph Mastery",
    subtitle: "Think in Graphs",
    description:
      "Transition from linear chains to stateful graph workflows. Master nodes, edges, state management, and conditional routing to build dynamic AI systems.",
    color: "from-purple-500 to-pink-400",
    icon: "🕸️",
    order: 2,
    sessions: phase2Sessions,
  },
  {
    id: "phase-3",
    title: "Production AI Agents",
    subtitle: "Build Production Systems",
    description:
      "Implement production-ready patterns: ReAct agents, multi-agent collaboration, tool use, and the final capstone project — a complete AI Research Assistant.",
    color: "from-orange-500 to-red-400",
    icon: "🚀",
    order: 3,
    sessions: phase3Sessions,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// USER STATE
// ═══════════════════════════════════════════════════════════════════════════════

export const defaultUserState: UserState = {
  currentPhaseId: "phase-1",
  currentSessionId: "p1-s1",
  completedSessionIds: [],
  balance: 500,
  langsmithApiKey: null,
  useLangsmith: false,
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

export function getPhaseById(id: string): Phase | undefined {
  return phases.find((p) => p.id === id);
}

export function getSessionById(sessionId: string): Session | undefined {
  for (const phase of phases) {
    const session = phase.sessions.find((s) => s.id === sessionId);
    if (session) return session;
  }
  return undefined;
}

export function getAllSessions(): Session[] {
  return phases.flatMap((p) => p.sessions);
}

export function getNextSession(currentSessionId: string): Session | null {
  const allSessions = getAllSessions();
  const idx = allSessions.findIndex((s) => s.id === currentSessionId);
  return idx >= 0 && idx < allSessions.length - 1 ? allSessions[idx + 1] : null;
}

export function getPrevSession(currentSessionId: string): Session | null {
  const allSessions = getAllSessions();
  const idx = allSessions.findIndex((s) => s.id === currentSessionId);
  return idx > 0 ? allSessions[idx - 1] : null;
}

export function getTotalSessionCount(): number {
  return phases.reduce((sum, p) => sum + p.sessions.length, 0);
}
