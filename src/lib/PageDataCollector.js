// import Player from './Player';
import Crew from './Crew';
// import Game from './Game';

/*
	Contains a method per page that returns the necessary data for that particular page
*/
class PageDataCollector {
	dataCrewOverview() {
		const crewArray = [];
		Crew.crewMembers.forEach((member) => {
			crewArray.push({
				userId: member.userId,
				screenName: member.screenName,
				avatar: member.avatar,
			});
		});
		const data = { crew: crewArray };
		return data;
	}
}

export default new PageDataCollector();
