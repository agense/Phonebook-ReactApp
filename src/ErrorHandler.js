export function handleErrors (resp) {
    let redirectPath = "";
    let redirect = false;
    let errors = [];
        switch(resp.status){
            case 404: 
                redirectPath="/NotFound";
                redirect = true;
                break;
            case 403: 
                redirectPath="/Unauthorized";
                redirect = true;
                break;
            case 401: 
                redirectPath="/Login";
                redirect = true;
                break;
            case 400: 
                if(resp.data.errors){
                    errors = {...resp.data.errors}
                }else if(resp.data.value.errors){
                    errors = {...resp.data.value.errors}
                }
                else{
                    console.log(resp);
                }
                break;
            default:
                redirectPath="/Error";
                redirect = true;
                break;
        }
    return {errors, redirect, redirectPath};
}
