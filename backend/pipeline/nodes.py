import re
import json
import httpx
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def process_node(node_type, data, input_text, inputs):
    if node_type == 'customInput':
        return data.get('inputName', 'input')

    elif node_type == 'text':
        text = data.get('text', '')
        if input_text:
            text = re.sub(r'\{\{[^}]+\}\}', input_text, text)
        return text

    elif node_type == 'llm':
        prompt = input_text or 'Hello!'
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500
        )
        return response.choices[0].message.content

    elif node_type == 'customOutput':
        return input_text

    elif node_type == 'filter':
        return input_text

    elif node_type == 'math':
        operation = data.get('operation', 'add')
        value = float(data.get('value', 0))
        num = float(input_text) if input_text else 0
        if operation == 'add':
            return str(num + value)
        elif operation == 'subtract':
            return str(num - value)
        elif operation == 'multiply':
            return str(num * value)
        elif operation == 'divide':
            return str(num / value if value != 0 else 0)

    elif node_type == 'merge':
        return ' | '.join(inputs)

    elif node_type == 'timer':
        return f"Timer: {data.get('interval', 5)} {data.get('unit', 'seconds')}"

    elif node_type == 'api':
        url = data.get('url', '')
        method = data.get('method', 'GET')
        if url:
            r = httpx.request(method, url, timeout=10)
            try:
                json_data = r.json()
                if 'setup' in json_data and 'punchline' in json_data:
                    return f"{json_data['setup']} ... {json_data['punchline']}"
                return json.dumps(json_data, indent=2)
            except:
                return r.text
        return 'No URL provided'

    return input_text