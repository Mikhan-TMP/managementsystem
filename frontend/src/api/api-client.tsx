export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';



// USERS
export const createUser = async (formData: any, token: string) => {
  console.log('Creating user with data:', formData);
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
    body: JSON.stringify({
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      roleId: parseInt(formData.role),
      department_id: parseInt(formData.department),
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to create user');
  }

  return result;
};

export async function getDepartments(token: string) {
  const response = await fetch(`${API_BASE_URL}/users/departments/list`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch departments');
  }
  return response.json();

}

export async function getRoles(token: string, departmentId: string) {
  const response = await fetch(`${API_BASE_URL}/users/roles?departmentId=${departmentId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch roles');
  }

  return response.json();
}

export async function getUsers(token: string) {
  const response = await fetch(`${API_BASE_URL}/users`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
}
export async function deleteUser(userId: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete user');
  }

  return response.json();
}
export const updateUser = async (
    userId: string,
    userData: {
        firstName: string;
        lastName: string;
        username: string;
        email: string;
        roleId: number;
        departmentId: number;
    },
    token: string
) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            first_name: userData.firstName,
            last_name: userData.lastName,
            username: userData.username,
            email: userData.email,
            role_id: userData.roleId,
            department_id: userData.departmentId,
        }),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || 'Failed to update user');
    }

    return result;
};

// SIDEBAR
export async function getSidebarItems(token: string) {
  const response = await fetch(`${API_BASE_URL}/sidebar/items`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch sidebar items');
  }

  return response.json();
}


// ATTENDANCE
export async function getAttendanceRecords(token: string) {
  const response = await fetch(`${API_BASE_URL}/attendance`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch attendance records');
  }

  return response.json();
}

export async function submitTimeEntry(accessToken: string, timeData: { time: string, remarks?: string }) {
    const response = await fetch(`${API_BASE_URL}/attendance/submit-time`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(timeData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit time entry');
    }

    return response.json();
}




// dashboard
export interface DashboardStats {
    totalUsers: number;
    totalDepartments: number;
    attendanceByDay: Array<{ date: string; count: number }>;
    attendanceRate: number;
    todayAttendance: number;
    employmentOverview: Array<{ month: string; count: number }>;
}

export const getDashboardStats = async (token: string): Promise<DashboardStats> => {
    try {
        console.log('Fetching dashboard stats from:', `${API_BASE_URL}/dashboard/stats`);
        console.log('With token:', token?.substring(0, 20) + '...');
        
        const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`Failed to fetch dashboard stats: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Dashboard data received:', data);
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};