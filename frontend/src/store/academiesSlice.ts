import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AcademyItem {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  location?: string;
  address?: string;
  city?: string;
  governorate?: string;
  price?: number;
  monthlyFee?: number;
  rating?: number;
  totalReviews?: number;
  curriculum?: string;
  languages?: string[];
  activities?: string[];
  minAgeAllowed?: number;
  maxAgeAllowed?: number;
  isVerified?: boolean;
  image?: string;
  logo?: string;
  coverImage?: string;
  gallery?: string[];
  phone?: string;
  email?: string;
  website?: string;
  branches?: any[];
  courses?: any[];
  reviews?: any[];
}

interface AcademiesState {
  academiesList: AcademyItem[];
  selectedAcademy: AcademyItem | null;
  loading: boolean;
}

const initialState: AcademiesState = {
  academiesList: [],
  selectedAcademy: null,
  loading: false,
};

const academiesSlice = createSlice({
  name: 'academies',
  initialState,
  reducers: {
    setAcademiesList(state, action: PayloadAction<AcademyItem[]>) {
      state.academiesList = action.payload;
    },
    setSelectedAcademy(state, action: PayloadAction<AcademyItem | null>) {
      state.selectedAcademy = action.payload;
      // Also update or add to academiesList cache
      if (action.payload) {
        const id = action.payload._id || action.payload.id;
        const index = state.academiesList.findIndex(a => (a._id === id || a.id === id));
        if (index >= 0) {
          state.academiesList[index] = action.payload;
        } else {
          state.academiesList.push(action.payload);
        }
      }
    },
    setAcademiesLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setAcademiesList, setSelectedAcademy, setAcademiesLoading } = academiesSlice.actions;
export default academiesSlice.reducer;
