\# Get started with Agent Skills in the API

\> Learn how to use Agent Skills to create documents with the Claude API in under 10 minutes.

This tutorial shows you how to use Agent Skills to create a PowerPoint presentation. You'll learn how to enable Skills, make a simple request, and access the generated file.

\#\# Prerequisites

\* \[Anthropic API key\](https://console.anthropic.com/settings/keys)  
\* Python 3.7+ or curl installed  
\* Basic familiarity with making API requests

\#\# What are Agent Skills?

Pre-built Agent Skills extend Claude's capabilities with specialized expertise for tasks like creating documents, analyzing data, and processing files. Anthropic provides the following pre-built Agent Skills in the API:

\* \*\*PowerPoint (pptx)\*\*: Create and edit presentations  
\* \*\*Excel (xlsx)\*\*: Create and analyze spreadsheets  
\* \*\*Word (docx)\*\*: Create and edit documents  
\* \*\*PDF (pdf)\*\*: Generate PDF documents

\<Note\>  
  \*\*Want to create custom Skills?\*\* See the \[Agent Skills Cookbook\](https://github.com/anthropics/claude-cookbooks/tree/main/skills) for examples of building your own Skills with domain-specific expertise.  
\</Note\>

\#\# Step 1: List available Skills

First, let's see what Skills are available. We'll use the Skills API to list all Anthropic-managed Skills:

\<CodeGroup\>  
  \`\`\`python Python theme={null}  
  import anthropic

  client \= anthropic.Anthropic()

  \# List Anthropic-managed Skills  
  skills \= client.beta.skills.list(  
      source="anthropic",  
      betas=\["skills-2025-10-02"\]  
  )

  for skill in skills.data:  
      print(f"{skill.id}: {skill.display\_title}")  
  \`\`\`

  \`\`\`typescript TypeScript theme={null}  
  import Anthropic from '@anthropic-ai/sdk';

  const client \= new Anthropic();

  // List Anthropic-managed Skills  
  const skills \= await client.beta.skills.list({  
    source: 'anthropic',  
    betas: \['skills-2025-10-02'\]  
  });

  for (const skill of skills.data) {  
    console.log(\`${skill.id}: ${skill.display\_title}\`);  
  }  
  \`\`\`

  \`\`\`bash Shell theme={null}  
  curl "https://api.anthropic.com/v1/skills?source=anthropic" \\  
    \-H "x-api-key: $ANTHROPIC\_API\_KEY" \\  
    \-H "anthropic-version: 2023-06-01" \\  
    \-H "anthropic-beta: skills-2025-10-02"  
  \`\`\`  
\</CodeGroup\>

You see the following Skills: \`pptx\`, \`xlsx\`, \`docx\`, and \`pdf\`.

This API returns each Skill's metadata: its name and description. Claude loads this metadata at startup to know what Skills are available. This is the first level of \*\*progressive disclosure\*\*, where Claude discovers Skills without loading their full instructions yet.

\#\# Step 2: Create a presentation

Now we'll use the PowerPoint Skill to create a presentation about renewable energy. We specify Skills using the \`container\` parameter in the Messages API:

\<CodeGroup\>  
  \`\`\`python Python theme={null}  
  import anthropic

  client \= anthropic.Anthropic()

  \# Create a message with the PowerPoint Skill  
  response \= client.beta.messages.create(  
      model="claude-sonnet-4-5-20250929",  
      max\_tokens=4096,  
      betas=\["code-execution-2025-08-25", "skills-2025-10-02"\],  
      container={  
          "skills": \[  
              {  
                  "type": "anthropic",  
                  "skill\_id": "pptx",  
                  "version": "latest"  
              }  
          \]  
      },  
      messages=\[{  
          "role": "user",  
          "content": "Create a presentation about renewable energy with 5 slides"  
      }\],  
      tools=\[{  
          "type": "code\_execution\_20250825",  
          "name": "code\_execution"  
      }\]  
  )

  print(response.content)  
  \`\`\`

  \`\`\`typescript TypeScript theme={null}  
  import Anthropic from '@anthropic-ai/sdk';

  const client \= new Anthropic();

  // Create a message with the PowerPoint Skill  
  const response \= await client.beta.messages.create({  
    model: 'claude-sonnet-4-5-20250929',  
    max\_tokens: 4096,  
    betas: \['code-execution-2025-08-25', 'skills-2025-10-02'\],  
    container: {  
      skills: \[  
        {  
          type: 'anthropic',  
          skill\_id: 'pptx',  
          version: 'latest'  
        }  
      \]  
    },  
    messages: \[{  
      role: 'user',  
      content: 'Create a presentation about renewable energy with 5 slides'  
    }\],  
    tools: \[{  
      type: 'code\_execution\_20250825',  
      name: 'code\_execution'  
    }\]  
  });

  console.log(response.content);  
  \`\`\`

  \`\`\`bash Shell theme={null}  
  curl https://api.anthropic.com/v1/messages \\  
    \-H "x-api-key: $ANTHROPIC\_API\_KEY" \\  
    \-H "anthropic-version: 2023-06-01" \\  
    \-H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \\  
    \-H "content-type: application/json" \\  
    \-d '{  
      "model": "claude-sonnet-4-5-20250929",  
      "max\_tokens": 4096,  
      "container": {  
        "skills": \[  
          {  
            "type": "anthropic",  
            "skill\_id": "pptx",  
            "version": "latest"  
          }  
        \]  
      },  
      "messages": \[{  
        "role": "user",  
        "content": "Create a presentation about renewable energy with 5 slides"  
      }\],  
      "tools": \[{  
        "type": "code\_execution\_20250825",  
        "name": "code\_execution"  
      }\]  
    }'  
  \`\`\`  
\</CodeGroup\>

Let's break down what each part does:

\* \*\*\`container.skills\`\*\*: Specifies which Skills Claude can use  
\* \*\*\`type: "anthropic"\`\*\*: Indicates this is an Anthropic-managed Skill  
\* \*\*\`skill\_id: "pptx"\`\*\*: The PowerPoint Skill identifier  
\* \*\*\`version: "latest"\`\*\*: The Skill version set to the most recently published  
\* \*\*\`tools\`\*\*: Enables code execution (required for Skills)  
\* \*\*Beta headers\*\*: \`code-execution-2025-08-25\` and \`skills-2025-10-02\`

When you make this request, Claude automatically matches your task to the relevant Skill. Since you asked for a presentation, Claude determines the PowerPoint Skill is relevant and loads its full instructions: the second level of progressive disclosure. Then Claude executes the Skill's code to create your presentation.

\#\# Step 3: Download the created file

The presentation was created in the code execution container and saved as a file. The response includes a file reference with a file ID. Extract the file ID and download it using the Files API:

\<CodeGroup\>  
  \`\`\`python Python theme={null}  
  \# Extract file ID from response  
  file\_id \= None  
  for block in response.content:  
      if block.type \== 'tool\_use' and block.name \== 'code\_execution':  
          \# File ID is in the tool result  
          for result\_block in block.content:  
              if hasattr(result\_block, 'file\_id'):  
                  file\_id \= result\_block.file\_id  
                  break

  if file\_id:  
      \# Download the file  
      file\_content \= client.beta.files.download(  
          file\_id=file\_id,  
          betas=\["files-api-2025-04-14"\]  
      )

      \# Save to disk  
      with open("renewable\_energy.pptx", "wb") as f:  
          file\_content.write\_to\_file(f.name)

      print(f"Presentation saved to renewable\_energy.pptx")  
  \`\`\`

  \`\`\`typescript TypeScript theme={null}  
  // Extract file ID from response  
  let fileId: string | null \= null;  
  for (const block of response.content) {  
    if (block.type \=== 'tool\_use' && block.name \=== 'code\_execution') {  
      // File ID is in the tool result  
      for (const resultBlock of block.content) {  
        if ('file\_id' in resultBlock) {  
          fileId \= resultBlock.file\_id;  
          break;  
        }  
      }  
    }  
  }

  if (fileId) {  
    // Download the file  
    const fileContent \= await client.beta.files.download(fileId, {  
      betas: \['files-api-2025-04-14'\]  
    });

    // Save to disk  
    const fs \= require('fs');  
    fs.writeFileSync('renewable\_energy.pptx', Buffer.from(await fileContent.arrayBuffer()));

    console.log('Presentation saved to renewable\_energy.pptx');  
  }  
  \`\`\`

  \`\`\`bash Shell theme={null}  
  \# Extract file\_id from response (using jq)  
  FILE\_ID=$(echo "$RESPONSE" | jq \-r '.content\[\] | select(.type=="tool\_use" and .name=="code\_execution") | .content\[\] | select(.file\_id) | .file\_id')

  \# Download the file  
  curl "https://api.anthropic.com/v1/files/$FILE\_ID/content" \\  
    \-H "x-api-key: $ANTHROPIC\_API\_KEY" \\  
    \-H "anthropic-version: 2023-06-01" \\  
    \-H "anthropic-beta: files-api-2025-04-14" \\  
    \--output renewable\_energy.pptx

  echo "Presentation saved to renewable\_energy.pptx"  
  \`\`\`  
\</CodeGroup\>

\<Note\>  
  For complete details on working with generated files, see the \[code execution tool documentation\](/en/docs/agents-and-tools/tool-use/code-execution-tool\#retrieve-generated-files).  
\</Note\>

\#\# Try more examples

Now that you've created your first document with Skills, try these variations:

\#\#\# Create a spreadsheet

\<CodeGroup\>  
  \`\`\`python Python theme={null}  
  response \= client.beta.messages.create(  
      model="claude-sonnet-4-5-20250929",  
      max\_tokens=4096,  
      betas=\["code-execution-2025-08-25", "skills-2025-10-02"\],  
      container={  
          "skills": \[  
              {  
                  "type": "anthropic",  
                  "skill\_id": "xlsx",  
                  "version": "latest"  
              }  
          \]  
      },  
      messages=\[{  
          "role": "user",  
          "content": "Create a quarterly sales tracking spreadsheet with sample data"  
      }\],  
      tools=\[{  
          "type": "code\_execution\_20250825",  
          "name": "code\_execution"  
      }\]  
  )  
  \`\`\`

  \`\`\`typescript TypeScript theme={null}  
  const response \= await client.beta.messages.create({  
    model: 'claude-sonnet-4-5-20250929',  
    max\_tokens: 4096,  
    betas: \['code-execution-2025-08-25', 'skills-2025-10-02'\],  
    container: {  
      skills: \[  
        {  
          type: 'anthropic',  
          skill\_id: 'xlsx',  
          version: 'latest'  
        }  
      \]  
    },  
    messages: \[{  
      role: 'user',  
      content: 'Create a quarterly sales tracking spreadsheet with sample data'  
    }\],  
    tools: \[{  
      type: 'code\_execution\_20250825',  
      name: 'code\_execution'  
    }\]  
  });  
  \`\`\`

  \`\`\`bash Shell theme={null}  
  curl https://api.anthropic.com/v1/messages \\  
    \-H "x-api-key: $ANTHROPIC\_API\_KEY" \\  
    \-H "anthropic-version: 2023-06-01" \\  
    \-H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \\  
    \-H "content-type: application/json" \\  
    \-d '{  
      "model": "claude-sonnet-4-5-20250929",  
      "max\_tokens": 4096,  
      "container": {  
        "skills": \[  
          {  
            "type": "anthropic",  
            "skill\_id": "xlsx",  
            "version": "latest"  
          }  
        \]  
      },  
      "messages": \[{  
        "role": "user",  
        "content": "Create a quarterly sales tracking spreadsheet with sample data"  
      }\],  
      "tools": \[{  
        "type": "code\_execution\_20250825",  
        "name": "code\_execution"  
      }\]  
    }'  
  \`\`\`  
\</CodeGroup\>

\#\#\# Create a Word document

\<CodeGroup\>  
  \`\`\`python Python theme={null}  
  response \= client.beta.messages.create(  
      model="claude-sonnet-4-5-20250929",  
      max\_tokens=4096,  
      betas=\["code-execution-2025-08-25", "skills-2025-10-02"\],  
      container={  
          "skills": \[  
              {  
                  "type": "anthropic",  
                  "skill\_id": "docx",  
                  "version": "latest"  
              }  
          \]  
      },  
      messages=\[{  
          "role": "user",  
          "content": "Write a 2-page report on the benefits of renewable energy"  
      }\],  
      tools=\[{  
          "type": "code\_execution\_20250825",  
          "name": "code\_execution"  
      }\]  
  )  
  \`\`\`

  \`\`\`typescript TypeScript theme={null}  
  const response \= await client.beta.messages.create({  
    model: 'claude-sonnet-4-5-20250929',  
    max\_tokens: 4096,  
    betas: \['code-execution-2025-08-25', 'skills-2025-10-02'\],  
    container: {  
      skills: \[  
        {  
          type: 'anthropic',  
          skill\_id: 'docx',  
          version: 'latest'  
        }  
      \]  
    },  
    messages: \[{  
      role: 'user',  
      content: 'Write a 2-page report on the benefits of renewable energy'  
    }\],  
    tools: \[{  
      type: 'code\_execution\_20250825',  
      name: 'code\_execution'  
    }\]  
  });  
  \`\`\`

  \`\`\`bash Shell theme={null}  
  curl https://api.anthropic.com/v1/messages \\  
    \-H "x-api-key: $ANTHROPIC\_API\_KEY" \\  
    \-H "anthropic-version: 2023-06-01" \\  
    \-H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \\  
    \-H "content-type: application/json" \\  
    \-d '{  
      "model": "claude-sonnet-4-5-20250929",  
      "max\_tokens": 4096,  
      "container": {  
        "skills": \[  
          {  
            "type": "anthropic",  
            "skill\_id": "docx",  
            "version": "latest"  
          }  
        \]  
      },  
      "messages": \[{  
        "role": "user",  
        "content": "Write a 2-page report on the benefits of renewable energy"  
      }\],  
      "tools": \[{  
        "type": "code\_execution\_20250825",  
        "name": "code\_execution"  
      }\]  
    }'  
  \`\`\`  
\</CodeGroup\>

\#\#\# Generate a PDF

\<CodeGroup\>  
  \`\`\`python Python theme={null}  
  response \= client.beta.messages.create(  
      model="claude-sonnet-4-5-20250929",  
      max\_tokens=4096,  
      betas=\["code-execution-2025-08-25", "skills-2025-10-02"\],  
      container={  
          "skills": \[  
              {  
                  "type": "anthropic",  
                  "skill\_id": "pdf",  
                  "version": "latest"  
              }  
          \]  
      },  
      messages=\[{  
          "role": "user",  
          "content": "Generate a PDF invoice template"  
      }\],  
      tools=\[{  
          "type": "code\_execution\_20250825",  
          "name": "code\_execution"  
      }\]  
  )  
  \`\`\`

  \`\`\`typescript TypeScript theme={null}  
  const response \= await client.beta.messages.create({  
    model: 'claude-sonnet-4-5-20250929',  
    max\_tokens: 4096,  
    betas: \['code-execution-2025-08-25', 'skills-2025-10-02'\],  
    container: {  
      skills: \[  
        {  
          type: 'anthropic',  
          skill\_id: 'pdf',  
          version: 'latest'  
        }  
      \]  
    },  
    messages: \[{  
      role: 'user',  
      content: 'Generate a PDF invoice template'  
    }\],  
    tools: \[{  
      type: 'code\_execution\_20250825',  
      name: 'code\_execution'  
    }\]  
  });  
  \`\`\`

  \`\`\`bash Shell theme={null}  
  curl https://api.anthropic.com/v1/messages \\  
    \-H "x-api-key: $ANTHROPIC\_API\_KEY" \\  
    \-H "anthropic-version: 2023-06-01" \\  
    \-H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \\  
    \-H "content-type: application/json" \\  
    \-d '{  
      "model": "claude-sonnet-4-5-20250929",  
      "max\_tokens": 4096,  
      "container": {  
        "skills": \[  
          {  
            "type": "anthropic",  
            "skill\_id": "pdf",  
            "version": "latest"  
          }  
        \]  
      },  
      "messages": \[{  
        "role": "user",  
        "content": "Generate a PDF invoice template"  
      }\],  
      "tools": \[{  
        "type": "code\_execution\_20250825",  
        "name": "code\_execution"  
      }\]  
    }'  
  \`\`\`  
\</CodeGroup\>

\#\# Next steps

Now that you've used pre-built Agent Skills, you can:

\<CardGroup cols={2}\>  
  \<Card title="API Guide" icon="book" href="/en/docs/build-with-claude/skills-guide"\>  
    Use Skills with the Claude API  
  \</Card\>

  \<Card title="Create Custom Skills" icon="code" href="/en/api/skills/create-skill"\>  
    Upload your own Skills for specialized tasks  
  \</Card\>

  \<Card title="Authoring Guide" icon="pen" href="/en/docs/agents-and-tools/agent-skills/best-practices"\>  
    Learn best practices for writing effective Skills  
  \</Card\>

  \<Card title="Use Skills in Claude Code" icon="terminal" href="https://code.claude.com/docs/en/skills"\>  
    Learn about Skills in Claude Code  
  \</Card\>

  \<Card title="Use Skills in the Agent SDK" icon="cube" href="/en/docs/agent-sdk/skills"\>  
    Use Skills programmatically in TypeScript and Python  
  \</Card\>

  \<Card title="Agent Skills Cookbook" icon="book-open" href="https://github.com/anthropics/anthropic-cookbook/blob/main/skills/README.md"\>  
    Explore example Skills and implementation patterns  
  \</Card\>  
\</CardGroup\>  
