import { Schema, model, models, Document, Model } from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  fname: string;
  lname: string;
  email: string;
  phone?: string;
  password: string;
  role: "admin" | "customer";
  admin?: Schema.Types.ObjectId;
  isVerified: boolean;
  tokens: { token: string }[];
  referral?: {
    referred: boolean;
    referredBy?: Schema.Types.ObjectId;
    used: boolean;
  };
  generateAuthToken(): Promise<string>;
  verifyCredentials(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUser> {
  findByCredentials(email: string, password: string): Promise<IUser>;
}

const userSchema = new Schema<IUser>(
  {
    fname: { type: String, required: true, trim: true },
    lname: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address");
        }
      },
    },
    phone: {
      type: String,
      trim: true,
      validate(value: string) {
        if (value && !validator.isMobilePhone(value, "any")) {
          throw new Error("Invalid phone number");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value: string) {
        if (value.toLowerCase().includes("password")) {
          throw new Error('Password cannot contain "password"');
        }
      },
    },
    role: {
      type: String,
      enum: ["admin", "customer"],
      required: true,
      default: "customer",
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: function (this: IUser) {
        return this.role === "customer"; // Required only if role is "customer"
      },
    },
    isVerified: { type: Boolean, default: false },
    tokens: [{ token: { type: String, required: true } }],

    referral: {
      type: new Schema(
        {
          referred: { type: Boolean, required: true, default: false },
          referredBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: function (this: IUser) {
              return this.referral?.referred; // Required only if referred is true
            },
          },
          used: {
            type: Boolean,
            required: function (this: IUser) {
              return this.referral?.referred as boolean; // Required only if referred is true
            },
            default: false,
          },
        },
        { _id: false }
      ),
      required: function (this: IUser) {
        return this.role === "customer"; // Referral only applies to customers
      },
    },
  },
  { timestamps: true }
);

// Remove sensitive fields from response
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.tokens;
  return user;
};

// Generate JWT Token
userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign(
    { _id: this._id.toString(), role: this.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  this.tokens.push({ token });
  await this.save();
  return token;
};

// Find user by email and password
userSchema.statics.findByCredentials = async function (
  email: string,
  password: string
): Promise<IUser> {
  const user = await this.findOne({ email });
  if (!user) throw new Error("Invalid login credentials.");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid login credentials.");

  return user;
};

// Verify password
userSchema.methods.verifyCredentials = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Prevent OverwriteModelError
const User =
  (models.User as IUserModel) || model<IUser, IUserModel>("User", userSchema);

export default User;
