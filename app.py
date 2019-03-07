from flask import Flask, render_template, url_for

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/registration')
def registration():
    return render_template('registration.html', form_url='/registration')


@app.route('/registration', methods="POST")
def registration():
    return render_template('registration.html', form_url='/registration')


if __name__ == "__main__":
    app.run(
        debug=True
    )
