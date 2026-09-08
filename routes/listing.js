const express=require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const listingControllers = require("../controllers/listings.js");

router.route("/")
.get(wrapAsync(listingControllers.index))
// .post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingControllers.createListing));
.post(
    isLoggedIn,
    upload.single("listing[image]"),

    (req, res, next) => {
        if (req.file) {
            req.body.listing.image = {
                url: req.file.path,
                filename: req.file.filename
            };
        }
        next();
    },

    validateListing,
    wrapAsync(listingControllers.createListing)
);
//New Route
router.get("/new",isLoggedIn,listingControllers.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingControllers.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingControllers.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingControllers.destroyListing));

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingControllers.renderEditForm));

module.exports = router;