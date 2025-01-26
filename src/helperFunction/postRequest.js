import { endpoints } from "../api/configs";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { resetStore } from "../redux/Reducers/resetStore";
import * as types from '../redux/types';

// postrequest.js


export async function CreateGroup(token, group_name , group_type ,  invitation_key , analytic_data , date , hourly_data) {
  try {
    const rawResponse = await fetch(endpoints.createGroup, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        group_name : group_name,
        group_type : group_type,
        invitation_key : invitation_key,
        analytic_data : analytic_data, 
        hourly_data : hourly_data,
        date : date
      }),
    });
    const response = await rawResponse.json();
    return response;
  } catch (error) {
    console.error('Error checking token:', error);
    throw error;
  }
}

export async function EditGroupApi(token, group_name , group_type , group_id ) {
  try {
    const rawResponse = await fetch(endpoints.editGroup, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        group_name : group_name,
        group_type : group_type,
        group_id : group_id
      }),
    });
    const response = await rawResponse.json();
    return response;
  } catch (error) {
    console.error('Error checking token:', error);
    throw error;
  }
}

export async function DeleteGroupApi(token, group_id ) {
  try {
    const rawResponse = await fetch(endpoints.deleteGroup, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        group_id : group_id
      }),
    });
    const response = await rawResponse.json();
    return response;
  } catch (error) {
    console.error('Error checking token:', error);
    throw error;
  }
}


export async function AnalyticApi(token, group_id, analytic_data , date) {
  try {
    const rawResponse = await fetch(endpoints.analytics, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        group_id : group_id,
        analytic_data : analytic_data,
        date : date
      }),
    });
    const response = await rawResponse.json();
    return response;
  } catch (error) {
    console.error('Error checking token:', error);
    throw error;
  }
}

export async function DeleteGroupMemberApi(token, group_id , user_delete_id ) {
  try {
    const rawResponse = await fetch(endpoints.deleteGroupMember, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        group_id : group_id,
        user_delete_id : user_delete_id
      }),
    });
    const response = await rawResponse.json();
    return response;
  } catch (error) {
    console.error('Error checking token:', error);
    throw error;
  }
}


export async function JoinGroupMembers(token, invitation_key , analytic_data , date , sharing_consent , hourly_data) {
  try {
    const rawResponse = await fetch(endpoints.joinGroup, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        invitation_key : invitation_key,
        analytic_data : analytic_data,
        hourly_data : hourly_data,
        date : date,
        sharing_consent : sharing_consent,
      }),
    });
    const response = await rawResponse.json();
    return response;
  } catch (error) {
    console.error('Error checking token:', error);
    throw error;
  }
}

export async function ShareConsentApi(token , group_id , date , analytic_data , hourly_data) {
  try {
    const rawResponse = await fetch(endpoints.shareConsent, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        group_id : group_id,
        date : date ,
        analytics_data : analytic_data, 
        hourly_data : hourly_data
      }),
    });
    const response = await rawResponse.json();
    return response;
  } catch (error) {
    console.error('Error checking token:', error);
    throw error;
  }
}

// export async function PostAnalyticsData(token , date , analytic_data) {
//   try {
//     const rawResponse = await fetch(endpoints.shareDailyAnalytics, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         token: token,
//         date : date ,
//         analytics_data : analytic_data, 
//       }),
//     });
//     const response = await rawResponse.json();
//     return response;
//   } catch (error) {
//     console.error('Error checking token:', error);
//     throw error;
//   }
// }

export async function GetGroups(token) {
  try {
    console.log(token);
    const response = await fetch(`${endpoints.getGroup}?token=${token}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error checking token:', error);
    throw error;
  }
}



export async function AnalyticsDateApi(token , group_id , date) {
  try {
    const response = await fetch(`${endpoints.getAnalyticsDataDate}?token=${token}&group_id=${group_id}&date=${date}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error checking token:', error);
    throw error;
  }
}
export async function AnalyticsUserDateApi(token , date ,user_id) {
  try {
    const response = await fetch(`${endpoints.getAnalyticsUserDataDate}?token=${token}&user_id=${user_id}&date=${date}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error checking token:', error);
    throw error;
  }
}

export async function getDistractedApps(group_id) {
  try {
    const response = await fetch(`${endpoints.getdistracted_apps}?group_id=${group_id}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error checking token:', error);
    throw error;
  }
}
export async function distractingAppSend(distracting_app_data , group_id ) {
  try {
    const rawResponse = await fetch(endpoints.sendDistracted_apps, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        distracting_app_data: distracting_app_data,
        group_id : group_id,
      }),
    });
    const response = await rawResponse.json();
    return response;
  } catch (error) {
    console.error('Error checking token:', error);
    throw error;
  }
}
