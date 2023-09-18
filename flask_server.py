import sys
import events_lib as evt
from flask import Flask, request, render_template, make_response

# Flask Settings and Initialization
HOST_NAME = "localhost"
HOST_PORT = 80
app = Flask(__name__)
# app.debug = True

# Flask Routes


@app.route('/', methods=['GET', 'POST'], strict_slashes=False)
def index():
    """Calendar Page"""
    return render_template("calendar.html")


@app.route('/get', methods=['POST'], strict_slashes=False)
def get():
    """Get Events"""
    data = dict(request.form)
    events = evt.get(int(data["month"], int(data["year"])))
    return "{}" if events is None else events


@app.route('/save', methods=['POST'], strict_slashes=False)
def save():
    """Save Events"""
    data = dict(request.form)
    ok = evt.save(data["s"], data["e"],
                  data["t"], data["c"],
                  data["b"], data["id"] if "id" in data else None)
    message = "OK" if ok else sys.last_value
    return make_response(message, 200)


@app.route('/delete', methods=['POST'], strict_slashes=False)
def delete():
    """Delete Events"""
    data = dict(request.form)
    ok = evt.delete(data["id"])
    message = "OK" if ok else sys.last_value
    return make_response(message, 200)

# Start Flask Server
if __name__ == '__main__':
    app.run(host=HOST_NAME, port=HOST_PORT)

# Path: lencalendar/flask_server.py