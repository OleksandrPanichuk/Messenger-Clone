'use client';

import {useActiveChannel} from "@/hooks";

const ActiveStatus = () => {
  useActiveChannel();

  return null;
}
 
export default ActiveStatus;