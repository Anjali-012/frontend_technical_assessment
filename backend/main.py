from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class Pipeline(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    run: Optional[bool] = False

def is_dag(nodes, edges):
    graph = {node['id']: [] for node in nodes}
    for edge in edges:
        if edge['source'] in graph:
            graph[edge['source']].append(edge['target'])

    visited = set()
    rec_stack = set()

    def has_cycle(node):
        visited.add(node)
        rec_stack.add(node)
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                if has_cycle(neighbor):
                    return True
            elif neighbor in rec_stack:
                return True
        rec_stack.remove(node)
        return False

    for node in graph:
        if node not in visited:
            if has_cycle(node):
                return False
    return True

def get_topological_order(nodes, edges):
    graph = {node['id']: [] for node in nodes}
    in_degree = {node['id']: 0 for node in nodes}
    
    for edge in edges:
        if edge['source'] in graph:
            graph[edge['source']].append(edge['target'])
            in_degree[edge['target']] = in_degree.get(edge['target'], 0) + 1
    
    queue = [n for n in in_degree if in_degree[n] == 0]
    order = []
    
    while queue:
        node = queue.pop(0)
        order.append(node)
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    return order

def execute_pipeline(nodes, edges):
    node_map = {node['id']: node for node in nodes}
    order = get_topological_order(nodes, edges)
    node_outputs = {}
    
    # Build edge map: target_id -> list of source_ids
    edge_map = {}
    for edge in edges:
        target = edge['target']
        if target not in edge_map:
            edge_map[target] = []
        edge_map[target].append(edge['source'])
    
    for node_id in order:
        node = node_map[node_id]
        node_type = node.get('type', '')
        data = node.get('data', {})
        
        # Get inputs from connected nodes
        inputs = []
        if node_id in edge_map:
            for src_id in edge_map[node_id]:
                if src_id in node_outputs:
                    inputs.append(node_outputs[src_id])
        
        input_text = ' '.join(inputs) if inputs else ''
        
        if node_type == 'customInput':
            node_outputs[node_id] = data.get('inputName', 'input')
            
        elif node_type == 'text':
            text = data.get('text', '')
            # Replace {{variable}} with input
            if input_text:
                import re
                text = re.sub(r'\{\{[^}]+\}\}', input_text, text)
            node_outputs[node_id] = text
            
        elif node_type == 'llm':
            prompt = input_text or 'Hello!'
            try:
                response = client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=500
                )
                node_outputs[node_id] = response.choices[0].message.content
            except Exception as e:
                node_outputs[node_id] = f"LLM Error: {str(e)}"
                
        elif node_type == 'customOutput':
            node_outputs[node_id] = input_text
            
        elif node_type == 'filter':
            node_outputs[node_id] = input_text
            
        elif node_type == 'math':
            try:
                operation = data.get('operation', 'add')
                value = float(data.get('value', 0))
                num = float(input_text) if input_text else 0
                if operation == 'add':
                    result = num + value
                elif operation == 'subtract':
                    result = num - value
                elif operation == 'multiply':
                    result = num * value
                elif operation == 'divide':
                    result = num / value if value != 0 else 0
                node_outputs[node_id] = str(result)
            except:
                node_outputs[node_id] = input_text
                
        elif node_type == 'merge':
            node_outputs[node_id] = ' | '.join(inputs)
            
        elif node_type == 'timer':
            node_outputs[node_id] = f"Timer: {data.get('interval', 5)} {data.get('unit', 'seconds')}"
            
        elif node_type == 'api':
            node_outputs[node_id] = f"API Call to: {data.get('url', 'N/A')} [{data.get('method', 'GET')}]"
        
        else:
            node_outputs[node_id] = input_text
    
    # Collect output node results
    output_results = {}
    for node in nodes:
        if node['type'] == 'customOutput':
            output_results[node['data'].get('outputName', node['id'])] = node_outputs.get(node['id'], '')
    
    return output_results

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: Pipeline):
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    dag = is_dag(pipeline.nodes, pipeline.edges)
    
    execution_results = {}
    if pipeline.run and dag:
        execution_results = execute_pipeline(pipeline.nodes, pipeline.edges)
    
    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': dag,
        'execution_results': execution_results
    }