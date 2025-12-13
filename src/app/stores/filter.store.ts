import { create } from 'zustand';


export interface OptionFilter {
  label: string;
  value: string;
}


interface IFilterPeriodeStore {
  periode: Date | undefined | null,
  setPeriode: (periode: Date | undefined | null) => void
}

export const useFilterPeriodeStore = create<IFilterPeriodeStore>()((set) => ({
  periode: undefined,
  setPeriode: (periode) => set({ periode })
}))

export const sanitizeFilterData = ({
                                     company,
                                     region,
                                     plant
                                   }: {
  company?: OptionFilter | null,
  region?: OptionFilter | null,
  plant?: OptionFilter | null
}) => {
  const companyValue = company?.value;
  let regionValue = undefined;

  if (region?.value) {
    regionValue = region?.value?.split('-')[1];
    if (!regionValue) {
      regionValue = '-'
    }
  }

  let plantValue = undefined;
  if (plant?.value) {
    plantValue = plant?.value?.split('-')[2];
    if (!plantValue) {
      plantValue = '-'
    }
  }

  return {
    companyValue,
    regionValue,
    plantValue
  }
}
