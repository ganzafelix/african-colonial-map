from flask import Flask, render_template, jsonify, request, redirect, url_for

app = Flask(__name__)

colonies = []

# ROUTES
@app.route('/')
def welcome():
    return render_template('welcome.html')

@app.route('/colonies')
def colonies():
    return render_template("colonies.html", active_page="colonies")

@app.route('/quiz')
def quiz():
    return render_template("quiz.html", active_page="quiz")

@app.route('/africa')
def africa():
    return render_template("africa.html", active_page="africa")


# AJAX FUNCTIONS (modified to return location data)
@app.route('/get_colonies', methods=['GET'])
def get_colonies():
    return jsonify(locations=colonies)

#search function
@app.route('/search')
def search():
    query = request.args.get('q')
    results = []
    result_count = 0

    if query:
        query = query.strip().lower()

        for colony in colonies:
            # Check if keys exist before accessing them
            colonizer = colony.get('Colony', '').lower()
            description = colony.get('Description', '').lower()
            
            matches = False
            
            highlighted_name = colony.get('Colony', 'N/A')
            highlighted_description = colony.get('Description', 'N/A')

            
            if query in colonizer:
                highlighted_name = highlight_text(highlighted_name, query)
                matches = True
                
            if query in description:
                highlighted_description = highlight_text(highlighted_description, query)
                matches = True
                
            
            if matches:
                results.append({
                    "title": highlighted_name,
                    "id": colony.get('Location_id', 'N/A'),
                    "type": "location",
                    "description": highlighted_description,
                    "image": colony.get('Image', '/static/images/placeholder.jpg'),
                })
                result_count += 1

    return render_template('results.html', results=results, query=query, display_type='search', result_count=result_count)


def highlight_text(text, query):
    if not text or not query:
        return text
        
    query = query.lower()
    result = ""
    remaining_text = text
    
    while remaining_text:
      
        i = remaining_text.lower().find(query)
        if i == -1:  
            result += remaining_text
            break
            
        
        result += remaining_text[:i]
        
        match_text = remaining_text[i:i+len(query)]
        result += f'<span class="highlight">{match_text}</span>'
        
        remaining_text = remaining_text[i+len(query):]
        
    return result

# VIEW ROUTE
@app.route('/view/<item_type>/<int:id>')
def view_item(item_type, id):
    query = request.args.get('q', '').strip() 
    item = None
    if item_type == "location":
        item = next((loc for loc in colonies if 'Colonizer_id' in loc and int(loc['Colonizer_id']) == id), None)

    if item:
       
        if query:
            for key in ['Colonizer', 'Description']:
                if key in item:
                    item[key] = highlight_text(item[key], query)
        return render_template('results.html', item=item, item_type=item_type, display_type='view', query=query)
    else:
        return "Item not found"


if __name__ == '__main__':
    app.run(debug=True, port=5000)