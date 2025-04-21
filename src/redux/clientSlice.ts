import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export type Client = {
  key: string;
  firstName: string;
  lastName: string;
  age: number;
  address: string;
};

interface ClientState {
  clients: Client[];
  loading: boolean;
}

const initialState: ClientState = {
  clients: [],
  loading: false
};

export const fetchClients = createAsyncThunk('client/fetchClients', async () => {
  const response = await axios.get('https://jsonplaceholder.typicode.com/users');
  return response.data.map((user: any): Client => ({
    key: user.id.toString(),
    firstName: user.name.split(' ')[0],
    lastName: user.name.split(' ')[1] || '',
    age: Math.floor(Math.random() * 30) + 20,
    address: `${user.address.city}, ${user.address.street}`,
  }));
});

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    addClient: (state, action: PayloadAction<Client>) => {
      state.clients.push(action.payload);
    },
    updateClient: (state, action: PayloadAction<Client>) => {
      const index = state.clients.findIndex(c => c.key === action.payload.key);
      if (index !== -1) {
        state.clients[index] = action.payload;
      }
    },
    deleteClient: (state, action: PayloadAction<string>) => {
      state.clients = state.clients.filter(c => c.key !== action.payload);
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchClients.pending, state => {
        state.loading = true;
      })
      .addCase(fetchClients.fulfilled, (state, action: PayloadAction<Client[]>) => {
        state.clients = action.payload;
        state.loading = false;
      })
      .addCase(fetchClients.rejected, state => {
        state.loading = false;
      });
  }
});

export const { addClient, updateClient, deleteClient } = clientsSlice.actions;
export default clientsSlice.reducer;
