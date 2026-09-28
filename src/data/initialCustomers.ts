import { CustomerApprovalRequest } from '../types';

export const initialCustomerApprovalRequests: CustomerApprovalRequest[] = [
  {
    id: 'req-7000455037',
    phone: '7000455037',
    name: 'Prashant Ratna Srivastava',
    address: 'Deepak Complex Bahawani More Pachrukhi, Siwan Bihar - 841241',
    status: 'approved',
    requestedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    approvedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'req-9835012345',
    phone: '9835012345',
    name: 'Ramesh Kumar Gupta',
    address: 'Near Shiv Mandir, Harpur Village, Pachrukhi, Siwan',
    status: 'pending',
    requestedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'req-9123456780',
    phone: '9123456780',
    name: 'Manoj Singh',
    address: 'Station Road, Beside High School, Pachrukhi, Siwan',
    status: 'pending',
    requestedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'req-8809123456',
    phone: '8809123456',
    name: 'Sunita Devi',
    address: 'Ward No. 4, Supaul Panchayat, Pachrukhi',
    status: 'approved',
    requestedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    approvedAt: new Date(Date.now() - 86400000 * 0.9).toISOString(),
  },
];
