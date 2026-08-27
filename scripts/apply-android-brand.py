# -*- coding: utf-8 -*-
"""بعد از cap add android: آیکون + دستهٔ game."""
import re
import shutil
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
ROOT = REPO / "android" / "app" / "src" / "main"
RES = ROOT / "res"
SRC = REPO / "resources" / "android"
MANIFEST = ROOT / "AndroidManifest.xml"


def copy_icons():
    if not SRC.exists():
        print("no resources/android")
        return
    for folder in [
        "mipmap-mdpi",
        "mipmap-hdpi",
        "mipmap-xhdpi",
        "mipmap-xxhdpi",
        "mipmap-xxxhdpi",
    ]:
        src = SRC / folder
        dst = RES / folder
        if not src.exists() or not dst.exists():
            continue
        for name in ("ic_launcher.png", "ic_launcher_round.png", "ic_launcher_foreground.png"):
            f = src / name
            if f.exists():
                shutil.copy2(f, dst / name)
                print("copied", dst / name)


def patch_manifest():
    if not MANIFEST.exists():
        return
    text = MANIFEST.read_text(encoding="utf-8")
    if "android:appCategory" not in text:
        text = text.replace("<application", '<application android:appCategory="game"', 1)
    # isGame قدیمی بعضی لانچرها
    if "android:isGame" not in text:
        text = text.replace("<application", '<application android:isGame="true"', 1)
    MANIFEST.write_text(text, encoding="utf-8")
    print("manifest patched")


def patch_strings():
    p = RES / "values" / "strings.xml"
    if not p.exists():
        return
    t = p.read_text(encoding="utf-8")
    t = re.sub(r"(<string name=\"app_name\">)[^<]+", r"\1جاسوس", t)
    t = re.sub(r"(<string name=\"title_activity_main\">)[^<]+", r"\1جاسوس", t)
    p.write_text(t, encoding="utf-8")
    print("strings patched")


def patch_gradle():
    p = REPO / "android" / "app" / "build.gradle"
    if not p.exists():
        print("no app/build.gradle")
        return
    t = p.read_text(encoding="utf-8")
    if "ANDROID_KEYSTORE_PATH" in t:
        print("gradle already signing-aware")
        return
    block = """
    signingConfigs {
        release {
            def ks = System.getenv("ANDROID_KEYSTORE_PATH")
            if (ks != null && ks.length() > 0) {
                storeFile file(ks)
                storePassword System.getenv("ANDROID_KEYSTORE_PASSWORD")
                keyAlias System.getenv("ANDROID_KEY_ALIAS")
                keyPassword System.getenv("ANDROID_KEY_PASSWORD")
            }
        }
    }
"""
    if "buildTypes" in t and "signingConfigs" not in t:
        t = t.replace("buildTypes", block + "\n    buildTypes", 1)
    t = t.replace(
        "buildTypes {\n        release {",
        "buildTypes {\n        release {\n            if (signingConfigs.release.storeFile != null) {\n                signingConfig signingConfigs.release\n            }",
        1,
    )
    if "signingConfig signingConfigs.release" not in t:
        t = t.replace(
            "release {",
            "release {\n            if (System.getenv(\"ANDROID_KEYSTORE_PATH\")) {\n                signingConfig signingConfigs.release\n            }",
            1,
        )
    p.write_text(t, encoding="utf-8")
    print("gradle signing patched")


if __name__ == "__main__":
    copy_icons()
    patch_manifest()
    patch_strings()
    patch_gradle()
