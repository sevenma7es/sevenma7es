import mongoose from "mongoose";

const { Schema } = mongoose;

const settingSchema = new Schema(
  {
    main_footer_copyright: {
      type: String,
      required: false,
    },
    home_kicker: {
      type: String,
      required: false,
    },
    home_title: {
      type: String,
      required: false,
    },
    home_title2: {
      type: String,
      required: false,
    },
    home_subtitle: {
      type: String,
      required: false,
    },
    home_section1: {
      type: String,
      required: false,
    },
    home_section2: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model("Setting", settingSchema);

export default Setting;
