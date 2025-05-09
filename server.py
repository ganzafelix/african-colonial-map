from flask import Flask, render_template, jsonify, request, redirect, url_for

app = Flask(__name__)

coloniesList = ['Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cameroon', 'Central African Republic', 'Chad', 'Comoros', 'Democratic Republic of Congo',
            'Republic of Congo', 'Djibouti', 'Egypt', 'Equitorial Guinea', 'Eritrea', 'Eswatini', 'Swaziland', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Ivory Coast', 
             'Kenya',' Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'Sao Tome and Principe',
             'Senegal',' Seychelles', 'Seirra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Tunisia', 'Togo', 'Uganda', 'Zambia', 'Zimbabwe' ]

AFRICA_REGIONS = {
    "Northern Africa": [
        "Algeria", "Egypt", "Libya", "Tunisia", "Mauritania", "Morocco", "Western Sahara"
    ],
    "Western Africa": [
        "Benin", "Burkina Faso", "Cape Verde", "Côte d'Ivoire", "Gambia", "Ghana", "Guinea",
        "Guinea-Bissau", "Liberia", "Mali", "Niger", "Nigeria", "Senegal", "Sierra Leone", "Togo"
    ],
    "Central Africa": [
        "Cameroon", "Central African Republic", "Chad", "Republic of the Congo",
        "Democratic Republic of the Congo", "Equatorial Guinea", "Gabon", "São Tomé and Príncipe"
    ],
    "Eastern Africa": [
        "Burundi", "Comoros", "Djibouti", "Eritrea", "Ethiopia", "Kenya", "Madagascar", 
        "Mauritius", "Rwanda", "Seychelles", "Somalia", "South Sudan", "Tanzania",
        "Uganda", "Mayotte", "Réunion","Sudan"
    ],
    "Southern Africa": [
        "Botswana", "Eswatini", "Lesotho", "Namibia", "South Africa","Angola", "Zambia","Zimbabwe","Mozambique", "Malawi"
    ]
}

COLONIZER_COUNTRIES_DICT = {
    "Britain": [
        "Egypt", "Sudan", "South Sudan", "Kenya", "Uganda", "Tanzania",
        "Malawi", "Zambia", "Zimbabwe", "Botswana", "South Africa", "Lesotho",
        "Eswatini", "Ghana", "Nigeria", "Sierra Leone", "The Gambia", "Somalia", "Libya", "Seychelles",
        "Mauritius", "Togo","Cameroon","Namibia", "Eritrea"
    ],
    "France": [
        "Algeria", "Morocco", "Tunisia", "Mauritania", "Mali", "Niger", "Chad",
        "Central African Republic", "Republic of the Congo", "Gabon", "Senegal",
        "Guinea", "Ivory Coast", "Burkina Faso", "Benin", "Togo", "Madagascar", "Djibouti", "Comoros", "Cameroon","Libya"
    ],
    "Portugal": [
        "Angola", "Mozambique", "Guinea-Bissau", "Cape Verde", "São Tomé and Príncipe"
    ],
    "Germany": [
        "Namibia", "Tanzania", "Cameroon", "Togo", "Rwanda", "Burundi"
    ],
    "Italy": [
        "Libya", "Eritrea", "Somalia"
    ],
    "Belgium": [
        "Democratic Republic of the Congo", "Rwanda", "Burundi"
    ],
    "Spain": [
        "Western Sahara", "Equatorial Guinea", "Morocco"
    ],
    "Uncolonized": [
        "Ethiopia", "Liberia"
    ]
}


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

@app.route('/locate-it')
def locate_it():
    return render_template("locate_it.html", active_page="quiz")

@app.route('/who-colonized-it')
def who_colonized_it():
    return render_template("who_colonized_it.html", active_page="quiz")

@app.route('/africa')
def africa():
    return render_template("africa.html", active_page="africa")

@app.route('/score')
def score():
    return render_template("score.html", active_page="quiz")


# AJAX FUNCTIONS (modified to return location data)
@app.route('/get_colonies', methods=['GET'])
def get_colonies():
    return jsonify(locations=colonies)

@app.route("/data/colonizers")
def get_colonizer_country_list():
    return jsonify(COLONIZER_COUNTRIES_DICT)

@app.route('/data/regions')
def get_regions():
    return jsonify(AFRICA_REGIONS)

#search function
@app.route('/search')
def search():
    raw_q = request.args.get('q', '').strip()
    query = raw_q.lower()
    matches = []

    if query:
        for colony in coloniesList:
            if query in colony.lower():
                matches.append({
                    'name': colony,
                    'wikilink': f'https://en.wikipedia.org/wiki/{colony.replace(" ", "_")}'
                })

    result_count = len(matches)
    return render_template(
        'results.html',
        query=raw_q,
        results=matches,
        display_type='search',
        result_count=result_count
    )

    result_count = len(matches)
    return render_template(
        'results.html',
        query=raw_q,
        results=matches,
        display_type='search',
        result_count=result_count
    )
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
