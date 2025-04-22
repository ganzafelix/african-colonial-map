from flask import Flask, render_template, jsonify, request, redirect, url_for

app = Flask(__name__)

coloniesList = ['Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cameroon', 'Central African Republic', 'Chad', 'Comoros', 'Democratic Republic of Congo',
            'Republic of Congo', 'Djibouti', 'Egypt', 'Equitorial Guinea', 'Eritrea', 'Eswatini', 'Swaziland', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Ivory Coast', 
             'Kenya',' Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'Sao Tome and Principe',
             'Senegal',' Seychelles', 'Seirra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Tunisia', 'Togo', 'Uganda', 'Zambia', 'Zimbabwe' ]

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
    query = request.args.get('q', '')
    wikilink = None  
    result_count = 0

    if query:
        query = query.strip()
        query_lower = query.lower()
        for colony in coloniesList:
            if query_lower == colony.lower():
                wikilink = "https://en.wikipedia.org/wiki/" + colony
                result_count = 1
                break
    
    return render_template('results.html', results=wikilink, query=query, display_type='search', result_count=result_count)

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