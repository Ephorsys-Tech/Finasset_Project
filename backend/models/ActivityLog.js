import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema(
  {
    adminEmail: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'LOGIN',
        'LOGOUT',
        'PASSWORD_RESET',
        'CREATE',
        'UPDATE',
        'DELETE',
        'STATUS_CHANGE',
        'EXPORT',
        'ADMIN_REGISTERED',
        'ACCOUNT_LOCKOUT',
        'PASSWORD_RESET_REQUESTED',
        'PASSWORD_RESET_COMPLETED',
      ],
    },
    entity: {
      type: String,
      required: true,
    },
    entityId: {
      type: String,
      default: '',
    },
    summary: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema);
