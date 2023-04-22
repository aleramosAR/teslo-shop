import useSWR from 'swr';
import { Grid, MenuItem, Select } from '@mui/material'
import { PeopleOutlined } from '@mui/icons-material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

import { AdminLayout } from '@/components/layouts'
import { IUser } from '@/interfaces';
import { tesloApi } from '@/api';
import { useEffect, useState } from 'react';

const UsersPage = () => {

  const { data, error } = useSWR<IUser[]>('/api/admin/users');
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data])


  if(!data && !error) return (<></>);

  const onRoleUpdated = async(userId:string, newRole:string) => {

    const previousUsers = users.map(user => ({ ...user }));
    const updatedUsers = users.map(user => ({
      ...user,
      role: userId === user._id ? newRole : user.role,
    }));
    console.log(userId);
    
    setUsers(updatedUsers);

    try {
      await tesloApi.put('/admin/users', {
        userId,
        role: newRole
      })
    } catch (error) {
      setUsers(previousUsers);
      console.log(error);
      alert('No se pudo actualizar el rol del usuario.');
    }
  }

  const columns:GridColDef[] = [
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre completo', width: 300 },
    {
      field: 'role',
      headerName: 'Rol',
      width: 300,
      renderCell: ({row}: GridRenderCellParams) => {

        return (
          <Select
            value={row.role}
            label="Rol"
            onChange={({target}) => onRoleUpdated(row.id, target.value)}
            sx={{ width: '300px' }}
          >
            <MenuItem value='client'>Client</MenuItem>
            <MenuItem value='admin'>Admin</MenuItem>
          </Select>
        )
      }
    }
  ];

  const rows = users.map(user => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role
  }));

  return (
    <AdminLayout
      title={'Usuarios'}
      subTitle={'Mantenimiento de usuarios'}
      icon={<PeopleOutlined />}
    >

      <Grid container className='fadeIn'>
        <Grid item xs={12} sx={{ height: 650 , width: '100%' }}>
          <DataGrid
            columns={columns}
            rows={rows}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
      
    </AdminLayout>
  )
}

export default UsersPage