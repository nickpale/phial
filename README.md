# phial
This is an app for keeping track of tasks, projects, and skills. Use tasks as building blocks for all kinds of goals in your life.

## API
The API is a Flask app that can be run locally for development.

### Setup
1. Install the latest version of Python
    - https://www.python.org/

2. Create a virtual environment
    - venv/ is in the .gitignore so you can make a virtual environment called venv in the project root or put it in a directory called venv. Keeping your virtual environment outside of the project works too. Whatever suits you.
    - `python -m venv venv/phial`

3. Activate your virtual environment
    - For Linux and Mac:

        `source ./venv/phial/bin/activate`

        For Windows:

        `venv\phial\Scripts\activate`

4. Install dependencies
    - `pip install -r api/requirements.txt`

### Run Development Server
1. ```bash
    cd api
    ```
2. For Linux and Mac:

    ```bash
    export FLASK_APP=main.py
    export FLASK_CONFIG="development"
    export FLASK_DEBUG=1
    ```

    For Windows cmd, use set instead of export:

    ```bash
    set FLASK_APP=main.py
    set FLASK_CONFIG="development"
    set FLASK_DEBUG=1
    ```

    For Windows PowerShell, use $env: instead of export:

    ```PowerShell
    $env:FLASK_APP = "main.py"
    $env:FLASK_CONFIG = "development"
    $env:FLASK_DEBUG = "1"
    ```

2. ```bash
    flask run
    ```


## Deploy with AWS CDK

Use Amazon Web Services Cloud Development Kit to deploy this app to the cloud.

### Useful commands

 * `cdk deploy`           deploy this stack to your default AWS account/region
 * `cdk diff`             compare deployed stack with current state
 * `cdk synth`            emits the synthesized CloudFormation template
