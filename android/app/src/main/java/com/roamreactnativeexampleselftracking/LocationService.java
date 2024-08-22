package com.roamreactnativeexampleselftracking;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.IBinder;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;

import com.roam.reactnative.RNRoamReceiver;

public class LocationService extends Service {

    private RNRoamReceiver mLocationReceiver;

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        register();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        unRegister();
        super.onDestroy();
    }

    private void register() {
        mLocationReceiver = new RNRoamReceiver();
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction("com.roam.android.RECEIVED");
        intentFilter.addAction("android.intent.action.BOOT_COMPLETED");
        registerReceiver(mLocationReceiver, intentFilter);
    }

    private void unRegister() {
        if (mLocationReceiver != null) {
            unregisterReceiver(mLocationReceiver);
        }
    }

}