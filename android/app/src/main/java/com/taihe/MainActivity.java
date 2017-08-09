package com.taihe;

//import com.baidu.lbsapi.MKGeneralListener;
//import com.baidu.mapapi.BMapManager;
import com.facebook.react.ReactActivity;
import com.baidu.mapapi.SDKInitializer;

import android.content.Context;
import android.os.Bundle;
//import android.widget.Toast;

public class MainActivity extends ReactActivity {

    private Context context;
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "taihe";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SDKInitializer.initialize(getApplicationContext());
        this.context = getApplicationContext();
        super.onCreate(savedInstanceState);
    }

    public Context getContext() {
        return this.context;
    }
}
