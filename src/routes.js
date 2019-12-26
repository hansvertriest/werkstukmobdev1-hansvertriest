// import pages
import HomePage from './pages/home';
import FirebasePage from './pages/firebase';
import MapboxPage from './pages/mapbox';
import Register from './pages/register';
import Login from './pages/login';
import Registeravatar from './pages/registerAvatar';
import Join from './pages/join';
import Crewoverview from './pages/crewOverview';
import Gamestart from './pages/gameStart';
import Game from './pages/game';
import Infected from './pages/infected';
import Loseparasite from './pages/loseParasite';
import Winplague from './pages/winPlague';
import Loseplague from './pages/losePlague';
import Changecaptain from './pages/changeCaptain';
import Connectionlost from './pages/connectionLost';
import Winparasite from './pages/winParasite';
import Newpassword from './pages/newPassword';
import Passwordsent from './pages/passwordSent';
import Account from './pages/account';
import Createinvite from './pages/createInvite';
import Createoverview from './pages/createOverview';
import Createsettings from './pages/createSettings';
import Taggedparasite from './pages/taggedParasite';
import Taggedplague from './pages/taggedPlague';
import Backcrewlist from './pages/backCrewList';
import Backcrewdetail from './pages/backCrewDetail';
import Permissiondenied from './pages/permissionDenied';

export default [
	{ path: '/home', view: HomePage },
	{ path: '/register', view: Register },
	{ path: '/login', view: Login },
	{ path: '/registerAvatar', view: Registeravatar },
	{ path: '/join', view: Join },
	{ path: '/crewOverview', view: Crewoverview },
	{ path: '/gameStart', view: Gamestart },
	{ path: '/game', view: Game },
	{ path: '/infected', view: Infected },
	{ path: '/loseParasite', view: Loseparasite },
	{ path: '/winPlague', view: Winplague },
	{ path: '/losePlague', view: Loseplague },
	{ path: '/changeCaptain', view: Changecaptain },
	{ path: '/connectionLost', view: Connectionlost },
	{ path: '/winParasite', view: Winparasite },
	{ path: '/newPassword', view: Newpassword },
	{ path: '/passwordSent', view: Passwordsent },
	{ path: '/account', view: Account },
	{ path: '/firebase', view: FirebasePage },
	{ path: '/createInvite', view: Createinvite },
	{ path: '/createOverview', view: Createoverview },
	{ path: '/createSettings', view: Createsettings },
	{ path: '/taggedParasite', view: Taggedparasite },
	{ path: '/taggedPlague', view: Taggedplague },
	{ path: '/backCrewList', view: Backcrewlist },
	{ path: '/backCrewDetail', view: Backcrewdetail },
	{ path: '/permissionDenied', view: Permissiondenied },
	{ path: '/mapbox', view: MapboxPage },
];
