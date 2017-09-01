package com.taihe;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import org.jonglee.reactnative.baidumap.BaiduMapReactPackage;
import org.jonglee.reactnative.baidumap.EventPackage;
import org.jonglee.reactnative.stree.PanoramaReactPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
// public class MainApplication extends NavigationApplication implements ReactApplication {
  private static MainApplication instance;
//  public BMapManager mBMapManager = null;


  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new VectorIconsPackage(),
          new BaiduMapReactPackage(),
              new PanoramaReactPackage(),
              new EventPackage(),
              new RNDeviceInfo()

      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    instance = this;
    SoLoader.init(this, /* native exopackage */ false);
  }

  public static MainApplication getInstance() {
    return instance;
  }
}
