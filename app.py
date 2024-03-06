import requests
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

orthanc_url = "http://localhost:8042"

@app.route('/')
def main():
    return render_template('index.html')

@app.route('/upload')
def upload():
    rtstruct_path = '/home/romain/Musique/3DicomLibrary/CovidScans/CovidScans/Subject1/lesdicomsmanquantes/rtstructAEnvoye.dcm'
    upload_url = orthanc_url + "/instances"
    files = {'file': open(rtstruct_path, 'rb')}
    response = requests.post(upload_url, files=files)
    print(response.text, response.status_code)
    return render_template("index.html ")

if __name__ == "__main__":
    app.run(debug=True)