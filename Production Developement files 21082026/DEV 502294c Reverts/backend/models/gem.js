const mongoose = require('mongoose');

const gemSchema = new mongoose.Schema({
userId: {
type: mongoose.Schema.Types.ObjectId,
ref: 'User',
required: true
  },
amount: {
type: Number,
required: true,
min: 0
  },
type: {
type: String,
enum: ['proof_of_play', 'curation', 'social_amplification', 'streak_bonus', 'other'],
default: 'other'
  },
sourceId: {
type: mongoose.Schema.Types.ObjectId,
refPath: 'sourceModel'
  },
sourceModel: {
type: String,
enum: ['Track', 'Post', 'Comment', 'Playlist', 'Other']
  },
description: {
type: String,
maxlength: 200
  },
createdAt: {
type: Date,
default: Date.now
  }
});

gemSchema.index({
userId: 1,
createdAt: -1 });
gemSchema.index({
createdAt: -1 });

module.exports = mongoose.model('Gem', gemSchema);