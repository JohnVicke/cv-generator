git add .
git commit -m "[DEPLOY]: push to heroku"
git subtree push --prefix server heroku master
