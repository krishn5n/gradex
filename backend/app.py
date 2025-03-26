from flask import Flask, request,jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
import datetime as dt
import google.generativeai as genai
from dotenv import load_dotenv
import os
import re

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://examapp_postgres_user:9pU98DVQDE1J4ICu1s9gig3MypeVDZJb@dpg-cvhonlogph6c73cducq0-a.singapore-postgres.render.com/examapp_postgres'
db = SQLAlchemy(app)

#Registering of teacher and Student -----------------------------------------------------------------------------------------
#----------------------------------------------------------------------------------------- -----------------------------------------------------------------------------------------
#----------------------------------------------------------------------------------------- -----------------------------------------------------------------------------------------


@app.route('/signin/teacher',methods=['POST'])
def signin_teacher():
    try:
        body = request.json
        email = body['email']
        passw = body['pass']
        with db.engine.connect() as connection:
            query = text("Select * from teachers where email = :email and pass = :passw")
            result = connection.execute(query,{
                "email":email,
                "passw":passw
            }).fetchone()

            if(result):
                return jsonify({'signin':True})
            else:
                return jsonify({'signin':False})
    except Exception as e:
        return jsonify({'Message':f"{e}"})

@app.route('/signin/student',methods=['POST'])
def signin_student():
    try:
        body = request.json
        regnos = body['regno']
        passw = body['pass']
        with db.engine.connect() as connection:
            query = text("Select * from students where regno = :regnos and password = :passw")
            result = connection.execute(query,{
                "regnos":regnos,
                "passw":passw
            }).fetchone()

            if(result):


                return jsonify({'signin':True})
            else:
                return jsonify({'signin':False})
    except Exception as e:
        return jsonify({'Message':f"{e}"})

@app.route('/signup/teacher',methods=['POST'])
def signup_teacher():
    try:
        body = request.json
        name = body['name']
        phone = body['phone']
        email = body['email']
        passw = body['pass']
        with db.engine.connect() as connec:
            query = text('INSERT INTO Teachers (Name, Email, PhoneNumber, Pass) VALUES (:name, :email, :phone, :passw);')
            connec.execute(query,{
                "name":name,
                "email":email,
                "phone":int(phone),
                "passw":passw
            })
            connec.commit()
            return jsonify({'Message':"Success"})
    except Exception as e:
        return jsonify({'Message':f"{e}"})

@app.route('/signup/student',methods=['POST'])
def signup_student():
    try:
        body = request.json
        name = body['name']
        regno = body['regno']
        email = body['email']
        passw = body['pass']
        imgurl = body['imgurl']
        with db.engine.connect() as connec:
            query = text('INSERT INTO Teachers (name, email, password, regno, imgurl) VALUES (:name, :email, :passw, :regno, :imgurl);')
            connec.execute(query,{
                "name":name,
                "email":email,
                "regno":regno,
                "passw":passw,
                "imgurl":imgurl
            })
            connec.commit()
            return jsonify({'Message':"Success"})
    except Exception as e:
        return jsonify({'Message':f"{e}"})


#Question Related  -------------------------------------------------------------------------------------------------------
#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
#----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
@app.route('/questionmake',methods=['POST'])
def questionmake():
    try:
        body = request.json
        topicname = body['topicname'].lower()
        questiontext = body['questiontext'].lower()
        diff = body['diff'].lower()
        options = body['options'].lower()
        correct = body['correctans']
        with db.engine.connect() as connec:
            query = text('INSERT INTO Teachers (topicname, questiontext, difficulty, options, correctanswer) VALUES (:topicname, :questiontext, :diff, :options, :correct);')
            connec.execute(query,{
                "topicname":topicname,
                "questiontext":questiontext,
                "diff":diff,
                "options":options,
                "correct":correct
            })
            connec.commit()
            return jsonify({'Message':"Success"})
    except Exception as e:
        return jsonify({'Message':f"{e}"})


@app.route('/questionshow', methods=['POST'])
def questionshow():
    try:
        body = request.json
        topicname = body['topicname']
        diff = body['diff']
        texts = "Select questionid, questiontext from questions where"
        flag = False
        retval = []

        #Diffitcults rating if present
        if diff != "":
            texts+=f" difficulty={diff} "
            flag = True
        
        if(flag):
            texts+= f"and topicname like '%{topicname[0].lower()}%'"
        else:
            texts+= f" topicname like '%{topicname[0].lower()}%'"
        
        #Topic name
        for i in range(1,len(topicname)):
            texts+=f" and topicname like '%{topicname[i].lower()}%'"
        
        with db.engine.connect() as connec:
            query = text(f"{texts}")
            result = connec.execute(query).fetchall()
            for i in result:
                retval.append([i[0],i[1]])
            connec.commit()
            return jsonify({'Message':"retval"})
    except Exception as e:
        return jsonify({'Message':f"{e}"})
    

@app.route('/topicsavail',methods=['GET'])
def topicsavail():
    try:
        topicsret = set()
        finalret = []
        with db.engine.connect() as connec:
            query = text(f"Select DISTINCT topicname from questions")
            ans = connec.execute(query).fetchall()
            for i in ans:
                splits = i[0].split(',')
                j = splits[0]
                if j not in topicsret:
                    topicsret.add(j)
                
            for ab in topicsret:
                ab = ab.strip()
                finalret.append(ab)

            connec.commit()
            return jsonify({'Message':finalret})
    except Exception as e:
        return jsonify({'Message':f"{e}"})
    

if __name__ == '__main__':
    app.run(debug=True)