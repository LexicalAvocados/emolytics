import { REHYDRATE } from 'redux-persist/constants';

const patreonCampaign = (state = {}, action) => {
  switch (action.type) {
    case 'SET_PATREON_CAMPAIGN_INFO':
      return action.campaign;
    case 'SET_LOGGED_OUT':
      return {};
    case 'persist/REHYDRATE':
      if (action.payload.patreonCampaign) return action.payload.patreonCampaign;
      else return state;
    default:
      return state;
  }
};

export default patreonCampaign;