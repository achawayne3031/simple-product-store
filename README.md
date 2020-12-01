User can register
User can login
User can add products
User will admin position can update and delete products
User can view products
API Endpoints
POST = User can login (/api/user/login);
POST = User can register (/api/user/signup);
POST = verify jsonwebtoken from the front-end to the back-end for position Authorization (/api/user/check)
POST = User to add products (/api/product/add);
GET = Get all the added products (/api/product/get);
GET = Get one particular product (/api/product/get/:id);
DELETE = User to delete one particular product (/api/admin/delete/:id) = (admin only);
PUT = User to update one particular product (/api/admin/update/:id) = (admin only);
