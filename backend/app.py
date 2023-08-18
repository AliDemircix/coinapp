#pip install flask flask_sqlalchemy flask_session
#pip install flask flask_sqlalchemy Werkzeug
import os
from flask import Flask, request, jsonify,session
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = os.getenv('SQLALCHEMY_TRACK_MODIFICATIONS')
CORS(app)
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

class Coin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    price = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {'id': self.id, 'name': self.name, 'amount': self.amount, 'price': self.price}
# with app.app_context():
#     db.create_all()
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

@app.route('/signup', methods=['POST'])
def signup():
    email = request.form.get('email')
    password = request.form.get('password')
    if not email or not password:
        return jsonify({
            'message': 'email and password are required.',
            'status':400
            }), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'message': 'email already exists.','status':409}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully.','status':201}), 201

@app.route('/login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password are required.','status':400}), 400

    user = User.query.filter_by(email=email).first()
    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)
        return jsonify({'access_token': access_token,'status':200}), 200
    else:
        return jsonify({'message': 'Invalid email or password.','status':401}), 401

@app.route('/logout', methods=['GET'])
def logout():
    # Clear session variables
    session.pop('user_id', None)
    session.pop('email', None)
    session.clear()  # Clear the session data

    return 'Logged out.', 200

@app.route('/coins', methods=['POST'])
def add_coin():
    data = request.json
    coin = Coin(name=data['name'], amount=data['amount'], price=data['price'])
    db.session.add(coin)
    db.session.commit()
    return jsonify(coin.to_dict())


@app.route('/coins', methods=['GET'])
def get_coins():
    coins = Coin.query.all()
    return jsonify([coin.to_dict() for coin in coins])

@app.route('/coins/<int:id>', methods=['DELETE'])
def delete_coin(id):
    coin = Coin.query.get(id)
    if coin is None:
        return jsonify({'message': 'Coin not found'}), 404
    else:
        db.session.delete(coin)
        db.session.commit()
        return jsonify({'message': 'Coin deleted'}), 200
    
@app.route('/coins/<int:id>/update', methods=['PUT'])
def update_coin(id):
    coin = Coin.query.get(id)
    if coin is None:
        return jsonify({'message': 'Coin not found'}), 404
    else:
        data = request.json
        if 'name' in data:
            coin.name = data['name']
        if 'amount' in data:
            coin.amount = data['amount']
        if 'price' in data:
            coin.price = data['price']
        db.session.commit()
        return jsonify(coin.to_dict())

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
