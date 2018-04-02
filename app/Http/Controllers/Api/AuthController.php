<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use App\Mail\RecoverPassword;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Http\Serializers\UserSerializer;
use App\User;
use App\Activity;
use GuzzleHttp\Client;
use Carbon\Carbon;
use Validator;
use JWTAuth;
use JWT;
use Log;
use URL;
use GeoIP;
use Config;
use Response;

class AuthController extends Controller
{

    public function __construct(UserSerializer $userSerializer)
    {
        $this->userSerializer = $userSerializer;

        $this->validations = [
            'email'      => 'required|email',
        ];
    }


    /**
     * Login a user with email/password
     */
    public function authenticate(Request $request)
    {
        $credentials = $request->only('email', 'password');

        try {
            // verify the credentials and create a token for the user
            if (!$token = $this->guard()->attempt($credentials)) {
                return response()->json([
                    'success'=> false,
                    'errors' => [
                        'Invalid credentials, please try again.'
                    ]
                ], 401);
            }
        } catch (JWTException $e) {
            // something went wrong
            return response()->json([
                'success'=> false,
                'errors' => ['could_not_create_token']
            ], 500);
        }

        $user = User::where('email', $credentials['email'])->get()->first();

        // if no errors are encountered we can return a JWT
        return response()->json([
            'success'   => true,
            'token' => $token,
            'user'  => $this->userSerializer->one($user, ['basic', 'full', 'private']),
        ]);
    }

    /**
     * Register a new user with email/password
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function signup(Request $request)
    {

        // 1.- Validate the required fields
        $validator = Validator::make($request->all(), [
            'name' => 'required|min:3|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success'=> false,
                'errors' => $validator->errors()->all()
            ], 400);
        }

        try{
            // 2.- Get the location for the new user based on their IP
            $geo = GeoIP::getLocation();
        }catch(Exception $e){
            $geo = [];
        }

        try {
            //3.- Set the avatar URL from gravatar
            $default = URL::to('/')."/images/avatar.png";
            $gravatar = "https://www.gravatar.com/avatar/" . md5( strtolower( trim( $request->input('email') ) ) ) . "?d=" . urlencode( $default ) . "&s=400";

            //4.- Create the user
            $user = new User();
            $user->fill([
                'name'      => $request->input('name'),
                'password'  => bcrypt($request->input('password')),
                'image'     => $gravatar,
                'country'   => $geo['country']
            ]);
            $user->email    = $request->input('email');
            $user->latitude = $geo['lat'];
            $user->longitude= $geo['lon'];
            $user->postcode = $geo['postal_code'];
            // $user->author   = Config::get('app.is_new_user_author');

            $user->save();

        } catch (Exception $e) {
            return Response::json([
                'success'   => false,
                'errors'    => ['User already exists.'],
            ], HttpResponse::HTTP_CONFLICT);
        }

        //5.- Create activity
        $activity = new Activity();
        $activity->fill([
            'action'    => 'signup',
            'user_id'   => $user->id,
            'reference_type'    => 'App\\User',
            'reference_id'      => $user->id
        ]);
        $activity->save();

        //6.- Authenticate
        $token = JWTAuth::fromUser($user);

        return response()->json([
            'success'   => true,
            'token'     => $token,
            'user'  => $this->userSerializer->one($user, ['basic', 'full', 'private']),
        ]);
    }

    /**
     * Login with Facebook.
     */
    public function facebook(Request $request)
    {
        $accessTokenUrl = 'https://graph.facebook.com/v2.9/oauth/access_token';
        $graphApiUrl = 'https://graph.facebook.com/v2.9/me';
        $params = [
            'code' => $request->input('code'),
            'client_id' => $request->input('clientId'),
            'redirect_uri' => $request->input('redirectUri'),
            'client_secret' => Config::get('jwt.facebook_secret')
        ];

        $client = new Client();
        // Step 1. get the access token.
        if($request->input('accessToken')){
            // 1.1 Get token from param. (Login from Mobile App)
            $accessToken = [
                'access_token' => $request->input('accessToken'),
                'fields' => 'id,name,email,picture,gender'
            ];
        }else{
            // 1.2 Exchange authorization code for access token. (Login from web)
            $accessToken = $client->get(
                              $accessTokenUrl,
                              ['query' => $params]
                            )->getBody();
            $accessToken = (array) json_decode($accessToken);
        }

        // Step 2. Retrieve profile information about the current user.
        $profile = $client->get($graphApiUrl, ['query' => $accessToken])->getBody();
        $profile = (array) json_decode($profile);

        // Step 3a. If user is already signed in, then link accounts.
        if ($request->header('Authorization'))
        {
            $user = User::where('facebook', $profile['id'])->first();
            if ($user){
                return response()->json([
                    'success'   => false,
                    'errors'    => ['There is already a Facebook account that belongs to you']
                ], 409);
            }

            $token = explode(' ', $request->header('Authorization'))[1];
            $payload = (array) JWT::decode($token, Config::get('jwt.secret'), array('HS256'));
            $user = User::find($payload['sub']);

            $user->facebook = $profile['id'];
            $user->name     = $profile['name'];
            $user->image    = "https://graph.facebook.com/".$profile['id']."/picture?type=large";
            $user->gender   = studly_case($profile['gender']);
            $user->author   = Config::get('app.is_new_user_author');

            $user->save();

            return response()->json([
                'success'   => true,
                'token'     => JWTAuth::fromUser($user),
                'user'      => $this->userSerializer->one($user, ['basic', 'full', 'private']),
            ]);
        }
        // Step 3b. Create a new user account or return an existing one.
        else
        {
            $user = User::where('facebook', $profile['id'])->first();
            if ($user){
                // User already exist in database, generate a new token to allow login
                $user->playlists;
                return response()->json([
                    'success'   => true,
                    'token'     => JWTAuth::fromUser($user),
                    'user'      => $this->userSerializer->one($user, ['basic', 'full', 'private']),
                ]);
            }else {
                // Some users doesn't have email on facebook
                // they use mobile phone number
                if (!array_key_exists('email', $profile)) {
                    // If user doesn't have email on facebook
                    // we will create a fake email using the default domain
                    $profile['email'] = $profile['id'].'@'.Config::get('mail.default_domain');
                }

                $user = User::where('email', $profile['email'])->first();

                // check if email exist and link accounts
                if ($user){
                    //update data from facebook
                    $user->name     = $profile['name'];
                    $user->image    = "https://graph.facebook.com/".$profile['id']."/picture?type=large";
                    $user->gender   = studly_case($profile['gender']);
                    $user->facebook = $profile['id'];
                    $user->save();
                    $user->playlists;

                    return response()->json([
                        'success'   => true,
                        'token'     => JWTAuth::fromUser($user),
                        'user'      => $this->userSerializer->one($user, ['basic', 'full', 'private']),
                    ]);
                }
            }

            // If is a complete new user, get the GEO location
            // and create a new user in database
            try{
                // Get the location for the new user based on their IP
                $geo = GeoIP::getLocation();
            }catch(Exception $e){
                $geo = [];
            }

            $gender = '';
            if (array_key_exists('gender', $profile)) {
              $gender = studly_case($profile['gender']);
            }

            $user = new User;
            $user->facebook = $profile['id'];
            $user->email    = $profile['email'];
            $user->password = bcrypt(str_random(20));  //generate a random password
            $user->name     = $profile['name'];
            $user->image    = "https://graph.facebook.com/".$profile['id']."/picture?type=large";
            $user->gender   = $gender;

            $user->country  = $geo['country'];
            $user->latitude = $geo['lat'];
            $user->longitude= $geo['lon'];
            $user->postcode = $geo['postal_code'];
            $user->author   = Config::get('app.is_new_user_author');

            $user->save();

            //create activity for signup
            $activity = new Activity();
            $activity->fill([
                'action'    => 'signup',
                'user_id'   => $user->id,
                'reference_type'    => 'App\\User',
                'reference_id'      => $user->id
            ]);
            $activity->save();

            return response()->json([
                'success'   => true,
                'token'     => JWTAuth::fromUser($user),
                'user'      => $this->userSerializer->one($user, ['basic', 'full', 'private']),
            ]);
        }
    }

    /**
     * Login with Twitter.
     * THIS IS NOT SUPPORTED YET!
     */
    public function twitter(Request $request)
    {
        $requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
        $accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
        $profileUrl = 'https://api.twitter.com/1.1/users/show.json?screen_name=';
        $client = new GuzzleHttp\Client();
        // Part 1 of 2: Initial request from Satellizer.
        if (!$request->input('oauth_token') || !$request->input('oauth_verifier'))
        {
            $requestTokenOauth = new Oauth1([
              'consumer_key' => Config::get('app.twitter_key'),
              'consumer_secret' => Config::get('app.twitter_secret'),
              'callback' => Config::get('app.twitter_callback')
            ]);
            $client->getEmitter()->attach($requestTokenOauth);
            // Step 1. Obtain request token for the authorization popup.
            $requestTokenResponse = $client->post($requestTokenUrl, ['auth' => 'oauth']);
            $oauthToken = array();
            parse_str($requestTokenResponse->getBody(), $oauthToken);
            // Step 2. Send OAuth token back to open the authorization screen.
            return response()->json($oauthToken);
        }
        // Part 2 of 2: Second request after Authorize app is clicked.
        else
        {
            $accessTokenOauth = new Oauth1([
                'consumer_key' => Config::get('app.twitter_key'),
                'consumer_secret' => Config::get('app.twitter_secret'),
                'token' => $request->input('oauth_token'),
                'verifier' => $request->input('oauth_verifier')
            ]);
            $client->getEmitter()->attach($accessTokenOauth);
            // Step 3. Exchange oauth token and oauth verifier for access token.
            $accessTokenResponse = $client->post($accessTokenUrl, ['auth' => 'oauth'])->getBody();
            $accessToken = array();
            parse_str($accessTokenResponse, $accessToken);
            $profileOauth = new Oauth1([
                'consumer_key' => Config::get('app.twitter_key'),
                'consumer_secret' => Config::get('app.twitter_secret'),
                'oauth_token' => $accessToken['oauth_token']
            ]);
            $client->getEmitter()->attach($profileOauth);
            // Step 4. Retrieve profile information about the current user.
            $profile = $client->get($profileUrl . $accessToken['screen_name'], ['auth' => 'oauth'])->json();
            // Step 5a. Link user accounts.
            if ($request->header('Authorization'))
            {
                $user = User::where('twitter', '=', $profile['id']);
                if ($user->first())
                {
                    return response()->json(['message' => 'There is already a Twitter account that belongs to you'], 409);
                }
                $token = explode(' ', $request->header('Authorization'))[1];
                $payload = (array) JWT::decode($token, Config::get('app.token_secret'), array('HS256'));
                $user = User::find($payload['sub']);
                $user->twitter = $profile['id'];
                $user->name = $user->name || $profile['screen_name'];
                $user->save();
                return response()->json(['token' => JWTAuth::fromUser($user)]);
            }
            // Step 5b. Create a new user account or return an existing one.
            else
            {
                $user = User::where('twitter', '=', $profile['id']);
                if ($user->first())
                {
                    return response()->json(['token' => JWTAuth::fromUser($user->first())]);
                }
                $user = new User;
                $user->twitter = $profile['id'];
                $user->name = $profile['screen_name'];
                $user->save();
                return response()->json(['token' => JWTAuth::fromUser($user)]);
            }
        }
    }

    /**
     * Forgot password, generates token and sends an email
     * to update the password.
     */
    public function forgot(Request $request) {
        $validator = Validator::make($request->all(), $this->validations);

        if ($validator->fails()) {
            return response()->json([
                'success'=> false,
                'errors' => $validator->errors()->all(),
            ], 400);
        }

        $user = User::where('email', $request->input('email'))->get()->first();
        if ($user) {
            // Setting the recovery token
            $user->recovery_token = str_random(50);
            $user->recovery_sent_at = Carbon::now();
            $user->save();

            // Send email with token
             Mail::to($user)->send(new RecoverPassword($user));

            return response()->json([
                'success'   => true,
                'message'  => 'Please check your email, we will send you a link to update your password. It will only be valid for the next 6 hours.',
            ]);
        }

        return response()->json([
            'success'=> false,
            'errors' => [
                'This user doesn\'t exist in our system, please make sure your spelling is correct.',
            ],
        ], 400);
    }

    /**
     * Login the user by the recovery token, basically a login using
     * email's token in case user forgot his password
     */
    public function recover(Request $request, $token) {
        $user = $this->userRepository->findUserByRecoveryToken($token);
        
        if ($user) {
            $sent_at = new Carbon($user->recovery_sent_at);
            $sent_at->addHours(6);
            $now = Carbon::now();

            // Check if is valid
            if ($sent_at >= $now) {
                return response()->json([
                    'success'   => true,
                    'token'     => JWTAuth::fromUser($user),
                    'user'      => $user,
                ]);
            }

            return response()->json([
                'success'   => false,
                'errors'    => [
                    'Your recovery link has expired. It\'s only valid for 6 hours. Try to recover your password again.',
                ],
            ], 401);
        }

        return response()->json([
            'success'   => false,
            'errors'    => ['User not found, seems like your recovery link is old. Try to recover your password again.'],
        ], 404);
    }

    /**
     * Logs out the user
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());

        return response()->json(compact('success'));
    }

    /**
     * Unlink provider.
     * @return \Illuminate\Http\Response
     */
    public function unlink(Request $request, $provider)
    {
        $user = User::find($request['user']['sub']);
        if (!$user)
        {
            return response()->json(['message' => 'User not found']);
        }
        $user->$provider = '';
        $user->save();

        return response()->json(array('token' => JWTAuth::fromUser($user)));
    }
}
