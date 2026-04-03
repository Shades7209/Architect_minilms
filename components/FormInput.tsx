
import { View, TextInput, Text,useWindowDimensions } from "react-native";
import { Controller } from "react-hook-form";

interface Props {
    control: any;
    name: string;
    placeholder: string;
    secureTextEntry?: boolean;

}

export const FormInput = ({
                              control,
                              name,
                              placeholder,
                              secureTextEntry,

                          }: Props) => {


    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View style={{ marginBottom: 12 }}>
                    <TextInput
                        placeholder={placeholder}
                        placeholderTextColor={"#64748B"}
                        value={value}
                        onChangeText={onChange}
                        secureTextEntry={secureTextEntry}
                        style={{
                            borderWidth: 1,
                            borderColor: error ? "red" : "#64748B",
                            padding: 12,
                            borderRadius: 8,

                            color:"white",



                        }}
                    />
                    {error && (
                        <Text style={{ color: "red", marginTop: 4 }}>
                            {error.message}
                        </Text>
                    )}
                </View>
            )}
        />
    );
};