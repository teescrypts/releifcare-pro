import { Schema, model, models, Document } from "mongoose";

export interface IBookedAppointment extends Document {
  admin: Schema.Types.ObjectId;
  client: Schema.Types.ObjectId;
  service: {
    bookedService: Schema.Types.ObjectId;
    name: string;
    description: string;
    price: number;
    duration?: number;
  };
  addons: {
    bookedAddon: Schema.Types.ObjectId;
    name: string;
    description?: string;
    price: number;
    duration?: number;
  }[];
  date: string; // ISO date (YYYY-MM-DD)
  bookedTime: { from: string; to: string };
  price: number;
  status: "pending" | "completed" | "cancelled";
  discount?: number;
  note?: string;
  reschedule: {
    isRescheduled: boolean;
    previousDates: [{ date: string; bookedTime: { from: string; to: string } }];
  };
  datetime?: Date; // New computed field
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IBookedAppointment>(
  {
    admin: { type: Schema.Types.ObjectId, ref: "User", required: true },
    client: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      bookedService: {
        type: Schema.Types.ObjectId,
        ref: "Service",
        required: true,
      },
      name: { type: String, required: true },
      description: { type: String, required: true },
      duration: { type: Number, required: true },
      price: { type: Number, required: true },
    },
    addons: [
      {
        bookedAddon: { type: Schema.Types.ObjectId },
        name: { type: String },
        description: { type: String },
        duration: { type: Number },
        price: { type: Number },
      },
    ],
    date: { type: String, required: true },
    bookedTime: {
      from: { type: String, required: true },
      to: { type: String, required: true },
    },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    reschedule: {
      isRescheduled: { type: Boolean, required: true, default: false },
      previousDates: [
        {
          date: String,
          bookedTime: {
            from: { type: String },
            to: { type: String },
          },
        },
      ],
    },
    discount: { type: Number, default: 0 },
    note: { type: String, trim: true },
    datetime: { type: Date, index: true },
  },
  { timestamps: true }
);

// ✅ Pre-save hook to generate datetime from date + bookedTime.from
AppointmentSchema.pre("save", function (next) {
  const appointment = this as IBookedAppointment;

  if (appointment.date && appointment.bookedTime?.from) {
    const isoString = `${appointment.date}T${appointment.bookedTime.from}:00`;
    appointment.datetime = new Date(isoString);
  }

  next();
});

// Prevent OverwriteModelError in development
const Appointment =
  models.Appointment ||
  model<IBookedAppointment>("Appointment", AppointmentSchema);

export default Appointment;
