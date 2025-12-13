import { useState } from "react";

const useFilterUrl = (url: string) => {
  const apiUrl = useState<string>(url);

  return apiUrl;
}

export default useFilterUrl;
