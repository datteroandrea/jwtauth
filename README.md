# SECURITY TIPS!
After the user has correctly logged in and stored the token you have to make sure that for each request
the user makes the token is validated! use jwt.verify(...) on each request!