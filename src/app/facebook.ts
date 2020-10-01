import { LoginManager, LoginResult, GraphRequest, GraphRequestManager, UserData, AccessToken } from 'react-native-fbsdk';
import { utils } from './utils';

const PERMISSIONS = ["public_profile", "email"];

/**
 * Access Facebook API.
 */
class Facebook {
    private static instance: Facebook;

    private constructor() {}

    static getInstance(): Facebook {
        if (!Facebook.instance) {
            Facebook.instance = new Facebook();
        }
        return Facebook.instance;
    }

    /**
     * Show Facebook login dialog.
     * 
     * Permissions are listed [here](https://bit.ly/3eJcrfg).
     */
    public async logIn(permissions:string[] = PERMISSIONS): Promise<LoginResult> {
        const loginResult = await LoginManager.logInWithPermissions(permissions);

        // if (loginResult.error) {
        //     utils.setMyDebbugTxt(JSON.stringify(loginResult.error, null, 4))
        // }

        return loginResult;
    }

    /**
     * Get logged in user.
     * 
     * In order to get some fields, you need to ask for special permission
     * from Facebook, gender for example.
     */
    public async getCurrentUser() {
        return new Promise<UserData|null>((resolve, reject) => {
            // Create graph request
            const graphRequest = new GraphRequest(
                '/me',
                
                {
                    parameters: {
                        fields: {
                            // For gender and some others, you need to ask FB for permission
                            string: 'id,name,email,first_name,last_name,gender'
                        }
                    },
                },

                (error?:object, result?:object) => {
                    if (error) {
                        resolve(null);
                    } else {
                        resolve(result);
                    }
                },
            );

            // Start graph request
            new GraphRequestManager().addRequest(graphRequest).start();
        });
    }

    public async getCurrentAccessToken() {
        const accessToken = await AccessToken.getCurrentAccessToken();
        return accessToken;
    }

    public logOut() {
        LoginManager.logOut();
    }
}

export const facebook = Facebook.getInstance();