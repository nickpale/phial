# phial
This is an app for keeping track of tasks, projects, and skills. Use tasks as building blocks for all kinds of goals in your life.

## Setup
1. Install the latest version of Python.
    - https://www.python.org/
2. Create a virtual environment.
    - venv/ is in the .gitignore so you can make a virtual environment called venv in the project root or put it in a directory called venv. Keeping your virtual environment outside of the project works too. Whatever suits you.
    - `python -m venv venv`
    
3. Activate your virtual environment.    
    - For Linux and Mac:
    
        `./venv/bin/activate`
    
        For Windows:

        `venv\Scripts\activate`

4. Install dependencies.
    - `pip install -r requirements.txt`

## Run Development Server
For Linux and Mac:

```bash
export FLASK_APP=api
export FLASK_ENV=development
flask run
```

For Windows cmd, use set instead of export:

```bash
set FLASK_APP=api
set FLASK_ENV=development
flask run
```

For Windows PowerShell, use $env: instead of export:

```bash
$env:FLASK_APP = "api"
$env:FLASK_ENV = "development"
flask run
```
