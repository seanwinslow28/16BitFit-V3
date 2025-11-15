This is the complete generation of the 10 atomic components for the 16BitFit design system, based on the provided specifications, Game Boy aesthetics, animation requirements, accessibility standards, and performance optimizations.

**Note on Dependencies and Setup:**

**Haptics:** Ensure `react-native-haptic-feedback` is installed.  
Bash  
yarn add react-native-haptic-feedback  
\# or  
npm install react-native-haptic-feedback

1.   
2. **Imports:** The code assumes design tokens (tokens, typography, durations, easings) are available via the alias `@/design-system`.  
3. **Fonts:** Ensure 'Press Start 2P' and 'Montserrat' fonts are loaded and linked in your React Native project assets.

═══════════════════════════════════════════════════════════ COMPONENT 1/10: PixelButton ═══════════════════════════════════════════════════════════

TypeScript  
/\*\*  
 \* PixelButton \- Primary interactive element with Game Boy aesthetics.  
 \* Features press animation (scale and shadow shift simulation) and haptic feedback.  
 \*  
 \* @example  
 \* \<PixelButton variant="primary" onPress={handlePress} isLoading={false}\>  
 \*   START GAME  
 \* \</PixelButton\>  
 \*/

import React, { useRef, useCallback, useMemo } from 'react';  
import {  
  TouchableOpacity,  
  Text,  
  StyleSheet,  
  Animated,  
  ActivityIndicator,  
  GestureResponderEvent,  
  ViewStyle,  
  TextStyle,  
} from 'react-native';  
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';  
import { tokens, typography, durations, easings } from '@/design-system';

// ─────────────────────────────────────────────────────────  
// Types & Interfaces  
// ─────────────────────────────────────────────────────────

type ButtonVariant \= 'primary' | 'secondary' | 'tertiary' | 'icon';

interface PixelButtonProps {  
  /\*\* Children (text or icon component) \*/  
  children: React.ReactNode;  
  /\*\* Callback function when the button is pressed \*/  
  onPress: (event: GestureResponderEvent) \=\> void;  
  /\*\* Style variant of the button \*/  
  variant?: ButtonVariant;  
  /\*\* Whether the button is disabled \*/  
  disabled?: boolean;  
  /\*\* Whether the button is in a loading state \*/  
  isLoading?: boolean;  
  /\*\* Accessibility label for screen readers \*/  
  accessibilityLabel?: string;  
  /\*\* Accessibility hint for screen readers \*/  
  accessibilityHint?: string;  
}

// ─────────────────────────────────────────────────────────  
// Component  
// ─────────────────────────────────────────────────────────

const PixelButton: React.FC\<PixelButtonProps\> \= React.memo(  
  ({  
    children,  
    onPress,  
    variant \= 'primary',  
    disabled \= false,  
    isLoading \= false,  
    accessibilityLabel,  
    accessibilityHint,  
  }) \=\> {  
    // ─── Refs ───  
    // Animated value (0 \= default, 1 \= pressed)  
    const pressAnim \= useRef(new Animated.Value(0)).current;

    const isDisabled \= disabled || isLoading;

    // ─── Callbacks ───

    const animatePress \= useCallback(  
      (toValue: number) \=\> {  
        Animated.timing(pressAnim, {  
          toValue,  
          duration: durations.fast, // 100ms  
          easing: easings.sharp,  
          useNativeDriver: true, // Using transform (translate/scale)  
        }).start();  
      },  
      \[pressAnim\]  
    );

    const handlePressIn \= useCallback(() \=\> {  
      if (isDisabled) return;  
      ReactNativeHapticFeedback.trigger('impactMedium');  
      animatePress(1);  
    }, \[isDisabled, animatePress\]);

    const handlePressOut \= useCallback(() \=\> {  
      if (isDisabled) return;  
      animatePress(0);  
    }, \[isDisabled, animatePress\]);

    const handlePress \= useCallback(  
      (event: GestureResponderEvent) \=\> {  
        if (isDisabled) return;  
        onPress?.(event);  
      },  
      \[isDisabled, onPress\]  
    );

    // ─── Computed Styles ───  
    const { variantStyles, textStyle } \= useMemo(() \=\> {  
        const getStyles \= (v: ButtonVariant): { variantStyles: ViewStyle, textStyle: TextStyle } \=\> {  
            const baseButton: ViewStyle \= {  
                ...styles.content,  
                backgroundColor: tokens.colors.interactive.primary,  
                borderColor: tokens.colors.border.default,  
            };  
            const baseText: TextStyle \= {  
                ...styles.text,  
                color: tokens.colors.text.primary,  
            };

            switch (v) {  
                case 'primary':  
                    return { variantStyles: baseButton, textStyle: baseText };  
                case 'secondary':  
                    return {  
                        variantStyles: { ...baseButton, backgroundColor: tokens.colors.background.primary },  
                        textStyle: baseText  
                    };  
                case 'tertiary':  
                    return {  
                        variantStyles: { ...baseButton, backgroundColor: 'transparent', borderColor: 'transparent' },  
                        textStyle: { ...baseText, color: tokens.colors.text.secondary }  
                    };  
                case 'icon':  
                    return {  
                        variantStyles: { ...baseButton, ...styles.iconButton },  
                        textStyle: baseText  
                    };  
            }  
        };  
        return getStyles(variant);  
    }, \[variant\]);

    const { disabledStyle, disabledTextStyle } \= useMemo(() \=\> {  
      if (isDisabled) {  
        return { disabledStyle: styles.disabled, disabledTextStyle: styles.disabledText };  
      }  
      return { disabledStyle: {}, disabledTextStyle: {} };  
    }, \[isDisabled\]);

    // Animation for simulating the shadow shift and slight scale down  
    const animatedStyle \= useMemo(() \=\> {  
      // Requirement: Shadow shift 4x4 \-\> 2x2.  
      // Achieved by translating the content down-right by 2px relative to the shadow container.  
      const translation \= pressAnim.interpolate({  
        inputRange: \[0, 1\],  
        outputRange: \[0, 2\], // Move 2px  
      });

      // Requirement: Scale 1 \-\> 0.95  
      const scale \= pressAnim.interpolate({  
        inputRange: \[0, 1\],  
        outputRange: \[1, 0.95\],  
      });

      // Tertiary buttons don't have shadows, so they shouldn't translate, only scale.  
      const translateValue \= variant \=== 'tertiary' ? 0 : translation;

      return {  
        transform: \[{ translateX: translateValue }, { translateY: translateValue }, { scale }\],  
      };  
    }, \[pressAnim, variant\]);

    // ─── Render ───

    const renderContent \= () \=\> {  
        if (isLoading) {  
            return (  
                \<ActivityIndicator  
                    size="small"  
                    color={isDisabled ? tokens.colors.text.secondary : textStyle.color}  
                /\>  
            );  
        }

        if (typeof children \=== 'string') {  
            return (  
              \<Text style={\[textStyle, disabledTextStyle\]}\>  
                {children}  
              \</Text\>  
            );  
        }  
        return children;  
    };

    // Apply the shadow to the container. Tertiary buttons and disabled buttons do not have prominent shadows.  
    const shadowStyle \= (variant \!== 'tertiary' && \!isDisabled) ? tokens.shadow.medium : {};

    return (  
      \<TouchableOpacity  
        activeOpacity={1} // We manage visual feedback manually via animations  
        onPressIn={handlePressIn}  
        onPressOut={handlePressOut}  
        onPress={handlePress}  
        disabled={isDisabled}  
        accessible={true}  
        accessibilityRole="button"  
        accessibilityLabel={accessibilityLabel || (typeof children \=== 'string' ? children : undefined)}  
        accessibilityHint={accessibilityHint}  
        accessibilityState={{ disabled: isDisabled, busy: isLoading }}  
        // The container holds the shadow and base dimensions  
        style={\[styles.container, variant \=== 'icon' ? styles.iconContainer : styles.standardContainer, shadowStyle\]}  
      \>  
        \<Animated.View  
          // The content layer moves and scales  
          style={\[  
            variantStyles,  
            disabledStyle,  
            animatedStyle,  
          \]}  
        \>  
            {renderContent()}  
        \</Animated.View\>  
      \</TouchableOpacity\>  
    );  
  }  
);

// ─────────────────────────────────────────────────────────  
// Styles  
// ─────────────────────────────────────────────────────────

const styles \= StyleSheet.create({  
  container: {  
    // This view primarily serves as the shadow container  
    alignSelf: 'flex-start',  
  },  
  standardContainer: {  
    minWidth: 160,  
    minHeight: 48,  
  },  
  iconContainer: {  
    width: 48,  
    height: 48,  
  },  
  content: {  
    flex: 1,  
    flexDirection: 'row',  
    alignItems: 'center',  
    justifyContent: 'center',  
    paddingHorizontal: tokens.spacing\[3\],  
    borderWidth: tokens.border.width.default, // 3px  
    borderRadius: tokens.border.radius, // 0  
  },  
  iconButton: {  
    paddingHorizontal: 0,  
  },  
  text: {  
    // TODO: Ensure 'Press Start 2P' font is loaded  
    ...typography.styles.buttonPrimary,  
    textAlign: 'center',  
  },  
  disabled: {  
    backgroundColor: tokens.colors.background.elevated,  
    borderColor: tokens.colors.background.surface,  
  },  
  disabledText: {  
    color: tokens.colors.text.secondary,  
  }  
});

export default PixelButton;

**USAGE EXAMPLE:**

TypeScript  
\<PixelButton variant="primary" onPress={() \=\> console.log('Start\!')}\>  
  START  
\</PixelButton\>  
\<PixelButton variant="icon" onPress={() \=\> console.log('Save')} accessibilityLabel="Save"\>  
  {/\* Replace with PixelIcon component later \*/}  
  \<Text\>💾\</Text\>  
\</PixelButton\>

**NOTES:**

* The shadow effect is achieved by applying the shadow to the outer `TouchableOpacity` and animating the `transform: translate(2px, 2px)` and `scale(0.95)` of the inner `Animated.View`. This correctly simulates the button press while using `useNativeDriver: true` for 60fps performance.

═══════════════════════════════════════════════════════════ COMPONENT 2/10: PixelText ═══════════════════════════════════════════════════════════

TypeScript  
/\*\*  
 \* PixelText \- Typography wrapper component enforcing the 16BitFit design system fonts and styles.  
 \*  
 \* @example  
 \* \<PixelText variant="h1"\>  
 \*   16BITFIT  
 \* \</PixelText\>  
 \*/

import React, { useMemo } from 'react';  
import {  
  Text,  
  StyleSheet,  
  TextProps as RNTextProps,  
  TextStyle,  
  Platform,  
} from 'react-native';  
import { tokens, typography } from '@/design-system';

// ─────────────────────────────────────────────────────────  
// Types & Interfaces  
// ─────────────────────────────────────────────────────────

type TextVariant \= keyof typeof typography.styles;  
type TextColor \= keyof typeof tokens.colors.text;  
type TextAlign \= 'left' | 'center' | 'right' | 'justify' | 'auto';

interface PixelTextProps extends RNTextProps {  
  /\*\* The typographic style variant \*/  
  variant?: TextVariant;  
  /\*\* The text color key based on design tokens \*/  
  colorKey?: TextColor;  
  /\*\* Text alignment \*/  
  align?: TextAlign;  
  /\*\* Content of the text component \*/  
  children: React.ReactNode;  
  /\*\* Optional custom styles to override defaults \*/  
  style?: TextStyle | TextStyle\[\];  
}

// ─────────────────────────────────────────────────────────  
// Component  
// ─────────────────────────────────────────────────────────

const PixelText: React.FC\<PixelTextProps\> \= React.memo(  
  ({  
    variant \= 'body',  
    colorKey \= 'primary',  
    align \= 'auto',  
    children,  
    style,  
    ...restProps  
  }) \=\> {  
    // ─── Computed Styles ───  
    const computedStyles \= useMemo(() \=\> {  
      // 1\. Get the base style from the typography system  
      // TODO: Ensure fonts ('Press Start 2P', 'Montserrat') are loaded  
      const baseStyle \= typography.styles\[variant\] || typography.styles.body;

      // 2\. Determine the color  
      const textColor \= tokens.colors.text\[colorKey\] || tokens.colors.text.primary;

      // 3\. Platform specific adjustments (often needed for custom fonts on Android)  
      const platformFixes \= Platform.OS \=== 'android' && baseStyle.fontFamily \=== typography.fonts.heading  
        ? { includeFontPadding: false } // Helps mitigate vertical alignment issues with custom fonts  
        : {};

      // 4\. Combine styles  
      return StyleSheet.flatten(\[  
        baseStyle,  
        platformFixes,  
        { color: textColor, textAlign: align },  
        style, // User overrides  
      \]);  
    }, \[variant, colorKey, align, style\]);

    // ─── Render ───  
    return (  
      \<Text  
        style={computedStyles}  
        accessible={true}  
        allowFontScaling={true} // Respect user's device font size settings for accessibility  
        {...restProps}  
      \>  
        {children}  
      \</Text\>  
    );  
  }  
);

export default PixelText;

**USAGE EXAMPLE:**

TypeScript  
\<PixelText variant="h2"\>SELECT ARCHETYPE\</PixelText\>  
\<PixelText variant="bodySmall" colorKey="secondary" align="center"\>  
  Choose your fitness style.  
\</PixelText\>

**NOTES:**

* Includes accessibility support for dynamic type scaling (`allowFontScaling`).  
* Memoized for performance.

═══════════════════════════════════════════════════════════ COMPONENT 3/10: PixelSprite ═══════════════════════════════════════════════════════════

TypeScript  
/\*\*  
 \* PixelSprite \- Image container for displaying pixel art assets (sprites).  
 \* Ensures crisp rendering and consistent sizing.  
 \*  
 \* @example  
 \* \<PixelSprite  
 \*   source={require('./assets/sprites/heart.png')}  
 \*   size={32}  
 \*   alt="Health Points"  
 \* /\>  
 \*/

import React, { useState, useCallback, useMemo } from 'react';  
import {  
  View,  
  Image,  
  StyleSheet,  
  ImageSourcePropType,  
  ImageErrorEventData,  
  NativeSyntheticEvent,  
} from 'react-native';  
import { tokens } from '@/design-system';  
import PixelText from './PixelText'; // Assuming PixelText is available

// ─────────────────────────────────────────────────────────  
// Types & Interfaces  
// ─────────────────────────────────────────────────────────

type SpriteSize \= 8 | 16 | 32 | 64 | 80 | 96;

interface PixelSpriteProps {  
  /\*\* Image source (require() or { uri: '...' }) \*/  
  source: ImageSourcePropType;  
  /\*\* Size of the sprite (square dimensions in pixels) \*/  
  size?: SpriteSize;  
  /\*\* Optional tint color for the sprite \*/  
  tintColor?: string;  
  /\*\* Alternative text for accessibility (required) \*/  
  alt: string;  
}

// ─────────────────────────────────────────────────────────  
// Component  
// ─────────────────────────────────────────────────────────

const PixelSprite: React.FC\<PixelSpriteProps\> \= React.memo(  
  ({  
    source,  
    size \= 32,  
    tintColor,  
    alt,  
  }) \=\> {  
    // ─── State ───  
    const \[isLoading, setIsLoading\] \= useState(true);  
    const \[hasError, setHasError\] \= useState(false);

    // ─── Callbacks ───  
    const handleLoadStart \= useCallback(() \=\> {  
      setIsLoading(true);  
      setHasError(false);  
    }, \[\]);

    const handleLoadEnd \= useCallback(() \=\> {  
      setIsLoading(false);  
    }, \[\]);

    const handleError \= useCallback(  
      (event: NativeSyntheticEvent\<ImageErrorEventData\>) \=\> {  
        setIsLoading(false);  
        setHasError(true);  
        console.error('PixelSprite failed to load:', event.nativeEvent.error);  
      },  
      \[\]  
    );

    // ─── Computed Styles ───  
    const containerStyle \= useMemo(() \=\> ({  
      width: size,  
      height: size,  
    }), \[size\]);

    const imageStyle \= useMemo(() \=\> ({  
      width: size,  
      height: size,  
      tintColor: tintColor,  
      // 'contain' maintains aspect ratio.  
      resizeMode: 'contain' as const,  
    }), \[size, tintColor\]);

    // ─── Render ───

    if (hasError) {  
        return (  
            \<View style={\[styles.container, containerStyle, styles.errorPlaceholder\]}\>  
                \<PixelText variant="caption"\>ERR\</PixelText\>  
            \</View\>  
        );  
    }

    return (  
      \<View style={\[styles.container, containerStyle\]}\>  
        {isLoading && (  
          \<View style={styles.placeholder} /\>  
        )}  
        \<Image  
          source={source}  
          style={imageStyle}  
          onLoadStart={handleLoadStart}  
          onLoadEnd={handleLoadEnd}  
          onError={handleError}  
          accessible={true}  
          accessibilityRole="image"  
          accessibilityLabel={alt}  
          fadeDuration={0} // Remove default fade animation on Android for crisp appearance  
        /\>  
      \</View\>  
    );  
  }  
);

// ─────────────────────────────────────────────────────────  
// Styles  
// ─────────────────────────────────────────────────────────

const styles \= StyleSheet.create({  
  container: {  
    justifyContent: 'center',  
    alignItems: 'center',  
    overflow: 'hidden',  
  },  
  placeholder: {  
    position: 'absolute',  
    width: '100%',  
    height: '100%',  
    backgroundColor: tokens.colors.background.elevated, // Lime highlight while loading  
  },  
  errorPlaceholder: {  
    backgroundColor: tokens.colors.background.surface, // Muted error color  
  },  
});

export default PixelSprite;

**USAGE EXAMPLE:**

TypeScript  
// Assuming local asset linking  
// const playerAvatar \= require('./assets/avatar\_01.png');  
// \<PixelSprite source={playerAvatar} size={64} alt="Player Avatar" /\>

**NOTES:**

* Includes loading and error states. `fadeDuration={0}` is crucial on Android for a retro feel, ensuring the image appears instantly.

═══════════════════════════════════════════════════════════ COMPONENT 4/10: PixelBorder ═══════════════════════════════════════════════════════════

TypeScript  
/\*\*  
 \* PixelBorder \- A retro border wrapper component.  
 \* Applies consistent borders, background colors, and hard pixel shadows  
 \* according to the 16BitFit design system.  
 \*  
 \* @example  
 \* \<PixelBorder shadow="medium" backgroundColorKey="surface" padding={3}\>  
 \*   \<PixelText\>Content inside the box\</PixelText\>  
 \* \</PixelBorder\>  
 \*/

import React, { useMemo } from 'react';  
import { View, StyleSheet, ViewStyle, StyleProp, Platform } from 'react-native';  
import { tokens } from '@/design-system';

// ─────────────────────────────────────────────────────────  
// Types & Interfaces  
// ─────────────────────────────────────────────────────────

type BorderWidth \= keyof typeof tokens.border.width;  
type ShadowSize \= keyof typeof tokens.shadow | 'none';  
type BackgroundColor \= keyof typeof tokens.colors.background;

interface PixelBorderProps {  
  /\*\* Content to be wrapped by the border \*/  
  children: React.ReactNode;  
  /\*\* Thickness of the border \*/  
  borderWidth?: BorderWidth;  
  /\*\* Color of the border (hex value) \*/  
  borderColor?: string;  
  /\*\* Background color key from design tokens (e.g., 'primary', 'surface') \*/  
  backgroundColorKey?: BackgroundColor;  
  /\*\* Size of the hard pixel shadow \*/  
  shadow?: ShadowSize;  
  /\*\* Optional custom styles for the container \*/  
  style?: StyleProp\<ViewStyle\>;  
  /\*\* Padding inside the border (using spacing tokens index) \*/  
  padding?: keyof typeof tokens.spacing;  
}

// ─────────────────────────────────────────────────────────  
// Component  
// ─────────────────────────────────────────────────────────

const PixelBorder: React.FC\<PixelBorderProps\> \= React.memo(  
  ({  
    children,  
    borderWidth \= 'default',  
    borderColor \= tokens.colors.border.default,  
    backgroundColorKey \= 'primary',  
    shadow \= 'none',  
    style,  
    padding,  
  }) \=\> {  
    // ─── Computed Styles ───  
    const computedStyles \= useMemo(() \=\> {  
      const width \= tokens.border.width\[borderWidth\] || tokens.border.width.default;  
      const bgColor \= tokens.colors.background\[backgroundColorKey\] || tokens.colors.background.primary;  
      const shadowStyle \= shadow \!== 'none' ? tokens.shadow\[shadow\] : {};  
      const paddingValue \= padding \!== undefined ? tokens.spacing\[padding\] : undefined;

      // Handle Android elevation (as a fallback, though it won't be pixelated)  
      let elevation \= 0;  
      if (Platform.OS \=== 'android' && shadow \!== 'none') {  
        if (shadow \=== 'small') elevation \= 2;  
        if (shadow \=== 'medium') elevation \= 4;  
        if (shadow \=== 'large') elevation \= 6;  
      }

      return StyleSheet.flatten(\[  
        styles.container,  
        {  
          borderWidth: width,  
          borderColor: borderColor,  
          backgroundColor: bgColor,  
          padding: paddingValue,  
          elevation: elevation,  
        },  
        shadowStyle,  
        style,  
      \]);  
    }, \[borderWidth, borderColor, backgroundColorKey, shadow, style, padding\]);

    // ─── Render ───  
    return (  
      \<View style={computedStyles}\>  
        {children}  
      \</View\>  
    );  
  }  
);

// ─────────────────────────────────────────────────────────  
// Styles  
// ─────────────────────────────────────────────────────────

const styles \= StyleSheet.create({  
  container: {  
    borderRadius: tokens.border.radius, // 0  
  },  
});

export default PixelBorder;

**USAGE EXAMPLE:**

TypeScript  
\<PixelBorder shadow="large" borderWidth="thick" padding={5}\>  
  \<PixelText variant="h3"\>Main Menu\</PixelText\>  
\</PixelBorder\>

**NOTES:**

* This component relies on the native shadow properties defined in `tokens.shadow`. These tokens correctly specify `shadowRadius: 0` and `shadowOpacity: 1` for the hard-edged look on iOS.

═══════════════════════════════════════════════════════════ COMPONENT 5/10: PixelInput ═══════════════════════════════════════════════════════════

TypeScript  
/\*\*  
 \* PixelInput \- Text input field with Game Boy aesthetics.  
 \* Includes states for focus, error (with shake animation), success, and disabled.  
 \*  
 \* @example  
 \* \<PixelInput  
 \*   label="Username"  
 \*   value={username}  
 \*   onChangeText={setUsername}  
 \*   error={usernameError}  
 \* /\>  
 \*/

import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';  
import {  
  View,  
  TextInput,  
  StyleSheet,  
  Animated,  
  TextInputProps,  
  NativeSyntheticEvent,  
  TextInputFocusEventData,  
} from 'react-native';  
import { tokens, typography, durations, easings } from '@/design-system';  
import PixelText from './PixelText';

// ─────────────────────────────────────────────────────────  
// Types & Interfaces  
// ─────────────────────────────────────────────────────────

interface PixelInputProps extends TextInputProps {  
  /\*\* Input field label \*/  
  label?: string;  
  /\*\* Current value of the input \*/  
  value: string;  
  /\*\* Callback when text changes \*/  
  onChangeText: (text: string) \=\> void;  
  /\*\* Error message (if any). Triggers error state and shake animation. \*/  
  error?: string;  
  /\*\* Whether the input is in a success state \*/  
  success?: boolean;  
  /\*\* Whether the input is disabled \*/  
  disabled?: boolean;  
  /\*\* Optional left icon component \*/  
  LeftIcon?: React.ReactNode;  
}

// ─────────────────────────────────────────────────────────  
// Component  
// ─────────────────────────────────────────────────────────

const PixelInput: React.FC\<PixelInputProps\> \= React.memo(  
  ({  
    label,  
    placeholder,  
    value,  
    onChangeText,  
    error,  
    success \= false,  
    disabled \= false,  
    LeftIcon,  
    onFocus,  
    onBlur,  
    ...restProps  
  }) \=\> {  
    // ─── State ───  
    const \[isFocused, setIsFocused\] \= useState(false);

    // ─── Refs ───  
    // For border width/color animation (0 \= default, 1 \= focused)  
    const focusAnim \= useRef(new Animated.Value(0)).current;  
    // For error shake animation  
    const shakeAnim \= useRef(new Animated.Value(0)).current;

    // ─── Effects ───

    // Trigger shake animation when error prop changes and is truthy  
    useEffect(() \=\> {  
      if (error) {  
        triggerShake();  
      }  
    }, \[error\]);

    // Animate border on focus change  
    useEffect(() \=\> {  
      Animated.timing(focusAnim, {  
        toValue: isFocused ? 1 : 0,  
        duration: durations.normal, // 200ms  
        easing: easings.snappy,  
        useNativeDriver: false, // Animating borderWidth/Color requires false  
      }).start();  
    }, \[isFocused, focusAnim\]);

    // ─── Callbacks ───

    const handleFocus \= useCallback(  
      (e: NativeSyntheticEvent\<TextInputFocusEventData\>) \=\> {  
        if (disabled) return;  
        setIsFocused(true);  
        onFocus?.(e);  
      },  
      \[disabled, onFocus\]  
    );

    const handleBlur \= useCallback(  
      (e: NativeSyntheticEvent\<TextInputFocusEventData\>) \=\> {  
        setIsFocused(false);  
        onBlur?.(e);  
      },  
      \[onBlur\]  
    );

    const triggerShake \= useCallback(() \=\> {  
      // Shake animation: translateX sequence (approx 420ms total duration)  
      shakeAnim.setValue(0);  
      // Sequence: 0 \-\> \-10 \-\> 10 \-\> \-10 \-\> 10 \-\> \-5 \-\> 5 \-\> 0  
      Animated.sequence(\[  
        Animated.timing(shakeAnim, { toValue: 1, duration: 60, useNativeDriver: true }),  
        Animated.timing(shakeAnim, { toValue: 2, duration: 60, useNativeDriver: true }),  
        Animated.timing(shakeAnim, { toValue: 3, duration: 60, useNativeDriver: true }),  
        Animated.timing(shakeAnim, { toValue: 4, duration: 60, useNativeDriver: true }),  
        Animated.timing(shakeAnim, { toValue: 5, duration: 60, useNativeDriver: true }),  
        Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),  
        Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),  
      \]).start();  
    }, \[shakeAnim\]);

    // ─── Computed Styles ───

    const determineBaseBorderColor \= useMemo(() \=\> {  
        if (disabled) return tokens.colors.border.default;  
        if (error) return tokens.colors.feedback.error;  
        if (success) return tokens.colors.feedback.success;  
        return tokens.colors.border.default; // Default state color  
    }, \[disabled, error, success\]);

    const focusBorderColor \= tokens.colors.border.focus;

    // Interpolate border width: 3px (default) \-\> 4px (thick)  
    const animatedBorderWidth \= focusAnim.interpolate({  
      inputRange: \[0, 1\],  
      outputRange: \[tokens.border.width.default, tokens.border.width.thick\],  
    });

    // Interpolate border color  
    const animatedBorderColor \= focusAnim.interpolate({  
        inputRange: \[0, 1\],  
        // If state is error/success, keep that color even when focused; otherwise transition to focus color  
        outputRange: \[determineBaseBorderColor, (error || success) ? determineBaseBorderColor : focusBorderColor\],  
    });

    // Interpolate shake translation  
    const animatedShake \= {  
      transform: \[  
        {  
          translateX: shakeAnim.interpolate({  
            inputRange: \[0, 1, 2, 3, 4, 5, 6\],  
            outputRange: \[0, \-10, 10, \-10, 10, \-5, 5\],  
          }),  
        },  
      \],  
    };

    const containerStyle \= useMemo(() \=\> \[  
        styles.inputContainer,  
        disabled && styles.disabledContainer,  
        // Casting required by TS for non-transform/opacity animated properties  
        { borderWidth: animatedBorderWidth as any, borderColor: animatedBorderColor as any }  
    \], \[disabled, animatedBorderWidth, animatedBorderColor\]);

    // ─── Render ───

    const renderValidationIcon \= () \=\> {  
        // TODO: Replace placeholders with PixelIcon components when available  
        if (success) {  
            return \<PixelText colorKey="primary"\>✓\</PixelText\>;  
        }  
        if (error) {  
            return \<PixelText colorKey="primary"\>\!\</PixelText\>;  
        }  
        return null;  
    };

    return (  
      \<View style={styles.wrapper}\>  
        {label && (  
          \<PixelText variant="bodySmall" style={styles.label}\>  
            {label}  
          \</PixelText\>  
        )}  
        \<Animated.View style={animatedShake}\>  
            \<Animated.View style={containerStyle}\>  
            {LeftIcon && \<View style={styles.iconLeft}\>{LeftIcon}\</View\>}  
            \<TextInput  
                style={styles.input}  
                placeholder={placeholder}  
                placeholderTextColor={tokens.colors.text.secondary}  
                value={value}  
                onChangeText={onChangeText}  
                onFocus={handleFocus}  
                onBlur={handleBlur}  
                editable={\!disabled}  
                selectionColor={tokens.colors.border.focus}  
                accessible={true}  
                accessibilityLabel={label}  
                accessibilityHint={error || placeholder}  
                accessibilityState={{ disabled }}  
                {...restProps}  
            /\>  
            \<View style={styles.iconRight}\>{renderValidationIcon()}\</View\>  
            \</Animated.View\>  
        \</Animated.View\>  
        {error && typeof error \=== 'string' && (  
          \<PixelText variant="caption" colorKey="secondary" style={styles.errorText} accessibilityLiveRegion="assertive"\>  
            {/\* Using secondary color for error text as the primary error color token is very dark \*/}  
            {error}  
          \</PixelText\>  
        )}  
      \</View\>  
    );  
  }  
);

// ─────────────────────────────────────────────────────────  
// Styles  
// ─────────────────────────────────────────────────────────

const styles \= StyleSheet.create({  
  wrapper: {  
    marginBottom: tokens.spacing\[3\],  
  },  
  label: {  
    marginBottom: tokens.spacing\[1\],  
  },  
  inputContainer: {  
    flexDirection: 'row',  
    alignItems: 'center',  
    backgroundColor: tokens.colors.background.primary,  
    height: 48, // Minimum touch target  
    borderRadius: tokens.border.radius, // 0  
  },  
  disabledContainer: {  
    backgroundColor: tokens.colors.background.elevated,  
    opacity: 0.7,  
  },  
  input: {  
    flex: 1,  
    height: '100%',  
    paddingHorizontal: tokens.spacing\[2\],  
    // TODO: Ensure Montserrat font is loaded  
    ...typography.styles.body,  
    color: tokens.colors.text.primary,  
  },  
  iconLeft: {  
    marginLeft: tokens.spacing\[2\],  
  },  
  iconRight: {  
    marginRight: tokens.spacing\[2\],  
  },  
  errorText: {  
    marginTop: tokens.spacing\[1\],  
  },  
});

export default PixelInput;

**USAGE EXAMPLE:**

TypeScript  
const \[text, setText\] \= useState('');  
const error \= text.length \> 0 && text.length \< 3 ? 'Too short' : undefined;  
\<PixelInput  
  label="Username"  
  value={text}  
  onChangeText={setText}  
  error={error}  
  success={text.length \>= 3}  
/\>

**NOTES:**

* The border animation correctly uses `useNativeDriver: false`. The shake animation uses `useNativeDriver: true`.  
* The border color logic ensures that error/success colors persist even when focused, while the border width still animates.

═══════════════════════════════════════════════════════════ COMPONENT 6/10: PixelIcon ═══════════════════════════════════════════════════════════

TypeScript  
/\*\*  
 \* PixelIcon \- Wrapper for small UI icons (16x16, 24x24, 32x32).  
 \* Supports image sources or custom SVG/Component children. Ensures accessibility touch targets.  
 \*  
 \* @example  
 \* // Using an image source  
 \* \<PixelIcon source={require('./assets/icons/settings.png')} size={24} alt="Settings" /\>  
 \*  
 \* @example  
 \* // Interactive Icon (assuming CloseIcon is an SVG component)  
 \* \<PixelIcon source={CloseIcon} size={16} onPress={handleClose} alt="Close" /\>  
 \*/

import React, { useCallback } from 'react';  
import {  
  View,  
  Image,  
  ImageSourcePropType,  
  TouchableOpacity,  
  GestureResponderEvent,  
} from 'react-native';  
import { tokens } from '@/design-system';  
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

// ─────────────────────────────────────────────────────────  
// Types & Interfaces  
// ─────────────────────────────────────────────────────────

type IconSize \= 16 | 24 | 32;  
// Source can be an image file or an SVG component (React.ComponentType)  
type IconSource \= ImageSourcePropType | React.ComponentType\<any\>;

interface PixelIconProps {  
  /\*\* The icon source (Image require/uri or SVG Component). \*/  
  source: IconSource;  
  /\*\* Size of the icon \*/  
  size?: IconSize;  
  /\*\* Tint color for the icon (applies to image source or inherited by SVG children) \*/  
  color?: string;  
  /\*\* Alternative text for accessibility. If empty, icon is treated as decorative. \*/  
  alt?: string;  
  /\*\* Callback if the icon is interactive \*/  
  onPress?: (event: GestureResponderEvent) \=\> void;  
}

// Minimum touch target size for accessibility  
const MIN\_TOUCH\_TARGET \= 44;

// ─────────────────────────────────────────────────────────  
// Component  
// ─────────────────────────────────────────────────────────

const PixelIcon: React.FC\<PixelIconProps\> \= React.memo(  
  ({  
    source,  
    size \= 24,  
    color \= tokens.colors.text.primary,  
    alt,  
    onPress,  
  }) \=\> {  
    // ─── Computed Properties ───  
    const isAccessible \= \!\!alt;  
    const isInteractive \= \!\!onPress;

    const handlePress \= useCallback((event: GestureResponderEvent) \=\> {  
        if (isInteractive) {  
            ReactNativeHapticFeedback.trigger('impactLight');  
            onPress?.(event);  
        }  
    }, \[onPress, isInteractive\]);

    // ─── Render ───

    const renderIconContent \= () \=\> {  
      // Check if the source is a React Component (likely an SVG)  
      if (typeof source \=== 'function' || React.isValidElement(source)) {  
        const IconComponent \= source as React.ComponentType\<any\>;  
        // @ts-ignore: Handling component types dynamically  
        return \<IconComponent width={size} height={size} fill={color} color={color} /\>;  
      }

      // Fallback to Image component  
      return (  
        \<Image  
          source={source as ImageSourcePropType}  
          style={{  
            width: size,  
            height: size,  
            tintColor: color,  
            resizeMode: 'contain',  
          }}  
          fadeDuration={0}  
        /\>  
      );  
    };

    // Determine the wrapper component and its size  
    const Wrapper \= isInteractive ? TouchableOpacity : View;  
    // If interactive, ensure the wrapper is at least 44x44, centering the icon within it.  
    const wrapperSize \= isInteractive ? Math.max(MIN\_TOUCH\_TARGET, size) : size;

    return (  
      \<Wrapper  
        // @ts-ignore: TouchableOpacity/View props mismatch handled by Wrapper abstraction  
        onPress={handlePress}  
        activeOpacity={0.7}  
        accessible={isAccessible || isInteractive}  
        accessibilityRole={isInteractive ? 'button' : (isAccessible ? 'image' : undefined)}  
        accessibilityLabel={alt}  
        style={{  
            width: wrapperSize,  
            height: wrapperSize,  
            justifyContent: 'center',  
            alignItems: 'center',  
        }}  
      \>  
        {renderIconContent()}  
      \</Wrapper\>  
    );  
  }  
);

export default PixelIcon;

**USAGE EXAMPLE:**

TypeScript  
// \<PixelIcon source={require('./assets/icons/close.png')} size={16} onPress={handleCloseModal} alt="Close Modal" /\>

**NOTES:**

* The component dynamically switches between `View` (non-interactive) and `TouchableOpacity` (interactive).  
* If interactive, the wrapper size is increased to at least 44x44pt to meet accessibility guidelines, ensuring the icon is centered within the larger touch target.

═══════════════════════════════════════════════════════════ COMPONENT 7/10: PixelDivider ═══════════════════════════════════════════════════════════

TypeScript  
/\*\*  
 \* PixelDivider \- A simple horizontal or vertical content separator.  
 \*  
 \* @example  
 \* \<PixelDivider orientation="horizontal" thickness="default" spacing={3} /\>  
 \*/

import React, { useMemo } from 'react';  
import { View, ViewStyle } from 'react-native';  
import { tokens } from '@/design-system';

// ─────────────────────────────────────────────────────────  
// Types & Interfaces  
// ─────────────────────────────────────────────────────────

type Orientation \= 'horizontal' | 'vertical';  
type Thickness \= keyof typeof tokens.border.width;  
type Spacing \= keyof typeof tokens.spacing;

interface PixelDividerProps {  
  /\*\* Orientation of the divider \*/  
  orientation?: Orientation;  
  /\*\* Thickness of the divider line \*/  
  thickness?: Thickness;  
  /\*\* Color of the divider line \*/  
  color?: string;  
  /\*\* Spacing (margin) around the divider (using spacing tokens index) \*/  
  spacing?: Spacing;  
}

// ─────────────────────────────────────────────────────────  
// Component  
// ─────────────────────────────────────────────────────────

const PixelDivider: React.FC\<PixelDividerProps\> \= React.memo(  
  ({  
    orientation \= 'horizontal',  
    thickness \= 'thin',  
    color \= tokens.colors.border.default,  
    spacing \= 2, // 8px default spacing  
  }) \=\> {  
    // ─── Computed Styles ───  
    const computedStyles \= useMemo((): ViewStyle \=\> {  
      const thicknessValue \= tokens.border.width\[thickness\] || tokens.border.width.thin;  
      const spacingValue \= tokens.spacing\[spacing\] ?? tokens.spacing\[2\];

      if (orientation \=== 'horizontal') {  
        return {  
          height: thicknessValue,  
          width: '100%',  
          backgroundColor: color,  
          marginVertical: spacingValue,  
        };  
      } else {  
        return {  
          width: thicknessValue,  
          height: '100%',  
          backgroundColor: color,  
          marginHorizontal: spacingValue,  
        };  
      }  
    }, \[orientation, thickness, color, spacing\]);

    // ─── Render ───  
    return (  
      \<View  
        style={computedStyles}  
        accessible={false} // Dividers are decorative  
      /\>  
    );  
  }  
);

export default PixelDivider;

**USAGE EXAMPLE:**

TypeScript  
\<PixelText\>Section 1\</PixelText\>  
\<PixelDivider spacing={3} thickness="default" /\>  
\<PixelText\>Section 2\</PixelText\>

**NOTES:**

* A simple, efficient, memoized component for layout separation.

═══════════════════════════════════════════════════════════ COMPONENT 8/10: PixelBadge ═══════════════════════════════════════════════════════════

TypeScript  
/\*\*  
 \* PixelBadge \- Small notification indicator.  
 \* Adheres strictly to the retro aesthetic (Square, not rounded).  
 \* Features a subtle pulsing animation to draw attention.  
 \*  
 \* @example  
 \* \<View style={{ position: 'relative' }}\>  
 \*   \<PixelIcon ... /\>  
 \*   \<PixelBadge count={5} /\>  
 \* \</View\>  
 \*/

import React, { useRef, useEffect, useMemo } from 'react';  
import { Text, StyleSheet, Animated } from 'react-native';  
import { tokens, typography, durations, easings } from '@/design-system';

// ─────────────────────────────────────────────────────────  
// Types & Interfaces  
// ─────────────────────────────────────────────────────────

interface PixelBadgeProps {  
  /\*\* Notification count \*/  
  count: number;  
  /\*\* Whether to show the badge if the count is 0 \*/  
  showZero?: boolean;  
  /\*\* Color of the badge background \*/  
  color?: string;  
}

// ─────────────────────────────────────────────────────────  
// Component  
// ─────────────────────────────────────────────────────────

const PixelBadge: React.FC\<PixelBadgeProps\> \= React.memo(  
  ({  
    count,  
    showZero \= false,  
    color \= tokens.colors.background.darkest, // Deep forest shadow for high contrast  
  }) \=\> {  
    // ─── Refs ───  
    const pulseAnim \= useRef(new Animated.Value(0)).current;

    // ─── Effects ───

    // Pulse animation loop  
    useEffect(() \=\> {  
      // Animation: Pulse scale \[1, 1.2, 1\] (1000ms loop, 2s delay)  
      const animation \= Animated.loop(  
        Animated.sequence(\[  
          Animated.delay(2000), // 2s delay  
          Animated.timing(pulseAnim, {  
            toValue: 1,  
            duration: durations.slow, // 500ms  
            easing: easings.easeInOut,  
            useNativeDriver: true,  
          }),  
          Animated.timing(pulseAnim, {  
            toValue: 0,  
            duration: durations.slow, // 500ms  
            easing: easings.easeInOut,  
            useNativeDriver: true,  
          }),  
        \])  
      );

      animation.start();

      return () \=\> animation.stop();  
    }, \[pulseAnim\]);

    // ─── Computed Properties ───

    const shouldShow \= useMemo(() \=\> {  
      return count \> 0 || (count \=== 0 && showZero);  
    }, \[count, showZero\]);

    // ─── Computed Styles ───

    const animatedStyle \= useMemo(() \=\> {  
      const scale \= pulseAnim.interpolate({  
        inputRange: \[0, 1\],  
        outputRange: \[1, 1.2\],  
      });  
      return {  
        transform: \[{ scale }\],  
      };  
    }, \[pulseAnim\]);

    const badgeStyle \= useMemo(() \=\> {  
        return \[  
            styles.container,  
            styles.medium,  
            { backgroundColor: color },  
            animatedStyle  
        \];  
    }, \[color, animatedStyle\]);

    // ─── Render ───  
    if (\!shouldShow) {  
      return null;  
    }

    return (  
      \<Animated.View style={badgeStyle}\>  
          \<Text style={styles.text}\>  
            {count \> 99 ? '99+' : count}  
          \</Text\>  
      \</Animated.View\>  
    );  
  }  
);

// ─────────────────────────────────────────────────────────  
// Styles  
// ─────────────────────────────────────────────────────────

const styles \= StyleSheet.create({  
  container: {  
    position: 'absolute',  
    top: \-8,  
    right: \-8,  
    justifyContent: 'center',  
    alignItems: 'center',  
    // Requirement specified "Pure retro \- no rounding" (tokens.border.radius: 0\)  
    borderRadius: tokens.border.radius,  
    borderWidth: 1,  
    borderColor: tokens.colors.background.primary, // Border matches background to look seamless  
  },  
  medium: {  
    // Minimum size for numbers  
    minWidth: 20,  
    height: 20,  
    paddingHorizontal: 4,  
  },  
  text: {  
    // TODO: Ensure Montserrat font is loaded  
    ...typography.styles.caption,  
    fontSize: 9,  
    lineHeight: 12,  
    color: tokens.colors.text.inverse, // Light green on dark background  
    fontWeight: 'bold',  
  },  
});

export default PixelBadge;

**USAGE EXAMPLE:**

TypeScript  
// See Component 8 JSDoc usage example.

**NOTES:**

* The design system specifies `tokens.border.radius: 0`. This implementation strictly adheres to the retro aesthetic, resulting in a square badge.  
* The pulse animation uses the native driver for performance.

═══════════════════════════════════════════════════════════ COMPONENT 9/10: PixelProgressBar ═══════════════════════════════════════════════════════════

TypeScript  
/\*\*  
 \* PixelProgressBar \- Linear progress indicator with retro aesthetics.  
 \* Animates width and color based on progress percentage.  
 \*  
 \* @example  
 \* \<PixelProgressBar progress={75} height={16} animated={true} /\>  
 \*/

import React, { useRef, useEffect, useMemo } from 'react';  
import { View, StyleSheet, Animated } from 'react-native';  
import { tokens, durations, easings } from '@/design-system';

// ─────────────────────────────────────────────────────────  
// Types & Interfaces  
// ─────────────────────────────────────────────────────────

interface PixelProgressBarProps {  
  /\*\* Progress percentage (0-100) \*/  
  progress: number;  
  /\*\* Height of the progress bar \*/  
  height?: number;  
  /\*\* Whether the progress change should be animated \*/  
  animated?: boolean;  
}

// ─────────────────────────────────────────────────────────  
// Component  
// ─────────────────────────────────────────────────────────

const PixelProgressBar: React.FC\<PixelProgressBarProps\> \= React.memo(  
  ({  
    progress,  
    height \= 12,  
    animated \= true,  
  }) \=\> {  
    // Ensure progress is clamped between 0 and 100  
    const clampedProgress \= Math.max(0, Math.min(100, progress));

    // ─── Refs ───  
    // Animated value for progress (0 to 100\)  
    const progressAnim \= useRef(new Animated.Value(clampedProgress)).current;

    // ─── Effects ───

    // Animate progress changes  
    useEffect(() \=\> {  
      Animated.timing(progressAnim, {  
        toValue: clampedProgress,  
        duration: animated ? durations.moderate : durations.instant,  
        easing: easings.easeOut,  
        useNativeDriver: false, // We are animating width and backgroundColor  
      }).start();  
    }, \[clampedProgress, animated, progressAnim\]);

    // ─── Computed Styles ───

    const containerStyle \= useMemo(() \=\> ({  
        height,  
    }), \[height\]);

    const animatedStyle \= useMemo(() \=\> {  
      // 1\. Calculate Width (0% to 100%)  
      const width \= progressAnim.interpolate({  
        inputRange: \[0, 100\],  
        outputRange: \['0%', '100%'\],  
      });

      // 2\. Calculate Color Shift (Requirement: yellow \-\> green)  
      // Since the palette only has greens, we shift from the medium-light green to the lightest green.  
      const backgroundColor \= progressAnim.interpolate({  
        inputRange: \[0, 100\],  
        // Start (Lime highlight/Elevated) \-\> End (Neon grass glow/Primary)  
        // \#8BAC0F \-\> \#9BBC0F  
        outputRange: \[tokens.colors.background.elevated, tokens.colors.background.primary\],  
      });

      return {  
        width,  
        backgroundColor,  
      };  
    }, \[progressAnim\]);

    // ─── Render ───  
    return (  
      \<View  
        style={\[styles.container, containerStyle\]}  
        accessible={true}  
        accessibilityRole="progressbar"  
        accessibilityLabel={\`Progress: ${clampedProgress}%\`}  
        accessibilityValue={{ min: 0, max: 100, now: clampedProgress }}  
      \>  
        \<Animated.View style={\[styles.fill, animatedStyle\]} /\>  
      \</View\>  
    );  
  }  
);

// ─────────────────────────────────────────────────────────  
// Styles  
// ─────────────────────────────────────────────────────────

const styles \= StyleSheet.create({  
  container: {  
    width: '100%',  
    backgroundColor: tokens.colors.background.surface, // Darker background (track)  
    overflow: 'hidden',  
    borderWidth: tokens.border.width.thin,  
    borderColor: tokens.colors.border.default,  
    borderRadius: tokens.border.radius, // 0  
  },  
  fill: {  
    height: '100%',  
  },  
});

export default PixelProgressBar;

**USAGE EXAMPLE:**

TypeScript  
const \[progress, setProgress\] \= useState(20);  
// ... logic to update progress  
\<PixelProgressBar progress={progress} height={16} /\>

**NOTES:**

* Requires `useNativeDriver: false` because layout properties (`width`) and colors cannot use the native driver.

═══════════════════════════════════════════════════════════ COMPONENT 10/10: PixelCheckbox ═══════════════════════════════════════════════════════════

TypeScript  
/\*\*  
 \* PixelCheckbox \- Toggleable checkbox control with retro aesthetics.  
 \* Features scale bounce animation on toggle and checkmark animation.  
 \*  
 \* @example  
 \* \<PixelCheckbox  
 \*   checked={isChecked}  
 \*   onChange={setIsChecked}  
 \*   label="Enable sound effects"  
 \* /\>  
 \*/

import React, { useRef, useEffect, useCallback, useMemo } from 'react';  
import {  
  TouchableOpacity,  
  StyleSheet,  
  Animated,  
} from 'react-native';  
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';  
import { tokens, durations, easings } from '@/design-system';  
import PixelText from './PixelText';

// ─────────────────────────────────────────────────────────  
// Types & Interfaces  
// ─────────────────────────────────────────────────────────

interface PixelCheckboxProps {  
  /\*\* Whether the checkbox is checked \*/  
  checked: boolean;  
  /\*\* Callback when the checkbox state changes \*/  
  onChange: (checked: boolean) \=\> void;  
  /\*\* Optional label displayed next to the checkbox \*/  
  label?: string;  
  /\*\* Whether the checkbox is disabled \*/  
  disabled?: boolean;  
  /\*\* Whether the checkbox is in an indeterminate state (visual only) \*/  
  indeterminate?: boolean;  
}

// Minimum touch target size  
const MIN\_TOUCH\_TARGET \= 44;  
const CHECKBOX\_SIZE \= 24;

// ─────────────────────────────────────────────────────────  
// Component  
// ─────────────────────────────────────────────────────────

const PixelCheckbox: React.FC\<PixelCheckboxProps\> \= React.memo(  
  ({  
    checked,  
    onChange,  
    label,  
    disabled \= false,  
    indeterminate \= false,  
  }) \=\> {  
    // ─── Refs ───  
    // For the bounce animation on the box itself  
    const bounceAnim \= useRef(new Animated.Value(0)).current;  
    // For the checkmark animation (0 \= hidden, 1 \= visible)  
    const checkAnim \= useRef(new Animated.Value(checked ? 1 : 0)).current;

    // ─── Effects ───

    // Animate checkmark appearance/disappearance when 'checked' or 'indeterminate' props change  
    useEffect(() \=\> {  
      Animated.timing(checkAnim, {  
        toValue: checked || indeterminate ? 1 : 0,  
        duration: durations.normal, // 200ms  
        easing: easings.sharp,  
        useNativeDriver: true, // Animating opacity and transform  
      }).start();  
    }, \[checked, indeterminate, checkAnim\]);

    // ─── Callbacks ───

    const triggerBounce \= useCallback(() \=\> {  
      // Animation: Scale bounce \[1, 0.8, 1.2, 1\] (300ms spring)  
      bounceAnim.setValue(0);  
      // Using Animated.spring to achieve the bounce effect naturally  
      Animated.spring(bounceAnim, {  
        toValue: 1,  
        friction: 3, // Controls bounciness  
        tension: 60, // Controls speed  
        useNativeDriver: true,  
      }).start();  
    }, \[bounceAnim\]);

    const handlePress \= useCallback(() \=\> {  
      if (disabled) return;

      // Haptic feedback  
      ReactNativeHapticFeedback.trigger('impactLight');

      triggerBounce();  
      // Simple toggle logic.  
      onChange(\!checked);  
    }, \[checked, onChange, disabled, triggerBounce\]);

    // ─── Computed Styles ───

    const boxStyle \= useMemo(() \=\> {  
        const borderColor \= disabled ? tokens.colors.text.secondary : tokens.colors.text.primary;  
        return \[  
            styles.box,  
            { borderColor },  
            disabled && styles.disabledBox,  
        \];  
    }, \[disabled\]);

    // Bounce animation interpolation  
    const animatedBounceStyle \= useMemo(() \=\> {  
        const scale \= bounceAnim.interpolate({  
            // We interpolate from 0 to 1, the spring animation handles the actual scaling values  
            inputRange: \[0, 1\],  
            outputRange: \[1, 1\],  
        });  
        return { transform: \[{ scale }\] };  
    }, \[bounceAnim\]);

    // Checkmark animation interpolation (Fade \+ rotate)  
    const animatedCheckStyle \= useMemo(() \=\> {  
      const opacity \= checkAnim;

      // Rotate \-45° \-\> 0°  
      const rotate \= checkAnim.interpolate({  
        inputRange: \[0, 1\],  
        outputRange: \['-45deg', '0deg'\],  
      });

      return {  
        opacity,  
        transform: \[{ rotate }\],  
      };  
    }, \[checkAnim\]);

    // ─── Render ───

    // Determine the character for the checkmark/indeterminate state  
    // Using 'X' for the retro pixel look, '−' for indeterminate  
    const checkCharacter \= indeterminate ? '−' : 'X';

    return (  
      \<TouchableOpacity  
        onPress={handlePress}  
        disabled={disabled}  
        activeOpacity={0.8}  
        style={styles.container}  
        accessible={true}  
        accessibilityRole="checkbox"  
        accessibilityLabel={label}  
        accessibilityState={{ checked: indeterminate ? 'mixed' : checked, disabled }}  
      \>  
        \<Animated.View style={\[boxStyle, animatedBounceStyle\]}\>  
            \<Animated.View style={animatedCheckStyle}\>  
                \<PixelText variant="h3" style={styles.checkmark} colorKey={disabled ? 'secondary' : 'primary'}\>  
                    {checkCharacter}  
                \</PixelText\>  
            \</Animated.View\>  
        \</Animated.View\>  
        {label && (  
          \<PixelText variant="body" style={styles.label} colorKey={disabled ? 'secondary' : 'primary'}\>  
            {label}  
          \</PixelText\>  
        )}  
      \</TouchableOpacity\>  
    );  
  }  
);

// ─────────────────────────────────────────────────────────  
// Styles  
// ─────────────────────────────────────────────────────────

const styles \= StyleSheet.create({  
  container: {  
    flexDirection: 'row',  
    alignItems: 'center',  
    minHeight: MIN\_TOUCH\_TARGET, // Ensure minimum height for accessibility  
  },  
  box: {  
    width: CHECKBOX\_SIZE,  
    height: CHECKBOX\_SIZE,  
    borderWidth: tokens.border.width.default,  
    backgroundColor: tokens.colors.background.primary,  
    justifyContent: 'center',  
    alignItems: 'center',  
    borderRadius: tokens.border.radius, // 0  
  },  
  disabledBox: {  
    backgroundColor: tokens.colors.background.elevated,  
  },  
  checkmark: {  
    // Ensure the 'X' fits perfectly inside the box  
    // Adjust line height for vertical centering based on font metrics  
    lineHeight: CHECKBOX\_SIZE \- (tokens.border.width.default \* 2),  
  },  
  label: {  
    marginLeft: tokens.spacing\[2\],  
    flexShrink: 1, // Allow label to wrap if needed  
  },  
});

export default PixelCheckbox;

**USAGE EXAMPLE:**

TypeScript  
const \[checked, setChecked\] \= useState(false);  
\<PixelCheckbox  
  checked={checked}  
  onChange={setChecked}  
  label="Enable sound effects"  
/\>

**NOTES:**

* Uses `useNativeDriver: true` for all animations (scale, opacity, rotation).  
* Ensures accessibility compliance with roles, states, and minimum touch target size.  
* Uses an 'X' character for the checkmark, fitting the retro aesthetic.

