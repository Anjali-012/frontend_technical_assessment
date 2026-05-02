from .dag import get_topological_order
from .nodes import process_node

def execute_pipeline(nodes, edges):
    node_map = {node['id']: node for node in nodes}
    order = get_topological_order(nodes, edges)
    node_outputs = {}

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

        inputs = []
        if node_id in edge_map:
            for src_id in edge_map[node_id]:
                if src_id in node_outputs:
                    inputs.append(node_outputs[src_id])

        input_text = ' '.join(inputs) if inputs else ''

        try:
            node_outputs[node_id] = process_node(node_type, data, input_text, inputs)
        except Exception as e:
            node_outputs[node_id] = f"Error: {str(e)}"

    output_results = {}
    for node in nodes:
        if node['type'] == 'customOutput':
            output_results[node['data'].get('outputName', node['id'])] = node_outputs.get(node['id'], '')

    return output_results